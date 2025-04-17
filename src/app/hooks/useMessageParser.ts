import { getMessage, updateChat } from '@/lib/database/queries/chats'
import { hasHitImageLimit, recordAIImageUsage } from '@/lib/database/queries/users'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useImageStore } from '@/lib/stores/imageStore'
import { generateEmailScript } from '@/lib/utils/email-script-generator'
import { ImageAspectRatio, resolveImageSrc } from '@/lib/utils/image-service'
import { createScopedLogger } from '@/lib/utils/logger'
import { determineAspectRatio, getEmailFromMessage } from '@/lib/utils/misc'
import { Message } from 'ai'
import namer from 'color-namer'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { updateEmailForMessage } from '../(chat)/actions'
import { notifySlack } from '../actions/notifySlack'

const logger = createScopedLogger('MessageParser')
const FREE_IMAGE_LIMIT = 6

// Get AI-friendly color description without the hexcode
const getColorDescription = (hexColor: string): string => {
  const colorNames = namer(hexColor)

  // Use the most common names from different naming systems
  return `${colorNames.basic[0].name}, resembling ${colorNames.ntc[0].name}`
}

// Aspect ratio type to match what resolveImageSrc expects

export function useMessageParser(message: Message) {
  const { setEmail, email } = useEmailStore()
  const { chatId, themeColor, borderRadius } = useChatStore()
  const { setHasHitLimit, setImageLoading, markImageAsPexels } = useImageStore()
  const session = useSession()
  const processedIds = useRef<Set<string>>(new Set())
  const lastContentRef = useRef<string>('')
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  // One-time check to see if this message has already been processed
  useEffect(() => {
    if (!chatId || !message.id || initialCheckDone || processedIds.current.has(message.id)) {
      return
    }

    const checkIfProcessed = async () => {
      try {
        const storedMessage = await getMessage(message.id)
        if (storedMessage?.email) {
          // Message already has email content in database, mark as processed
          processedIds.current.add(message.id)
        }
        setInitialCheckDone(true)
      } catch (error) {
        logger.error('Error checking message status:', error)
        setInitialCheckDone(true) // Mark as done even on error to avoid infinite retries
      }
    }

    checkIfProcessed()
  }, [chatId, message.id, initialCheckDone])

  // Process message when it gets a closing tag
  useEffect(() => {
    if (!chatId || !message.content || processedIds.current.has(message.id) || !initialCheckDone) {
      return
    }

    // Check if new content contains a closing tag that wasn't there before
    const hasNewCloseTag = message.content.includes('</EMAIL>') && !lastContentRef.current.includes('</EMAIL>')

    // Update the last seen content
    lastContentRef.current = message.content

    // Only process when we see a new closing tag
    if (hasNewCloseTag) {
      const hasOpenTag = message.content.includes('<EMAIL') && message.content.match(/<EMAIL\s+[^>]*>/)

      // Only process if we have both opening and closing tags
      if (hasOpenTag) {
        // Mark as processed immediately to prevent reprocessing
        processedIds.current.add(message.id)
        processEmailContent(message)
      }
    }
  }, [message.content, message.id, chatId, initialCheckDone])

  const processEmailContent = async (message: Message) => {
    const emailObject = getEmailFromMessage(message, themeColor || '#8e6ff7', borderRadius, !email)

    if (emailObject && chatId) {
      try {
        // Generate email content first
        const emailContent = generateEmailScript(emailObject)

        // Save email immediately to improve responsiveness
        setEmail(emailObject)
        await updateChat(chatId, { email: emailContent })
        await updateEmailForMessage(chatId, message, emailObject)
        logger.debug(`Successfully processed email from message ${message.id}`)

        // Check for image generation requests in the email content by examining blocks
        const imageGenRequests = new Map<string, { aspectRatio: ImageAspectRatio; blockId: string }>()

        // Recursively search for image blocks with imagegen src in each column of each row
        if (emailObject.rows && Array.isArray(emailObject.rows)) {
          for (const row of emailObject.rows) {
            if (row.columns && Array.isArray(row.columns)) {
              for (const column of row.columns) {
                if (column.blocks && Array.isArray(column.blocks)) {
                  for (const block of column.blocks) {
                    if (
                      block.type === 'image' &&
                      block.attributes &&
                      block.attributes.src &&
                      block.attributes.src.startsWith('imagegen:')
                    ) {
                      const aspectRatio = determineAspectRatio(row)
                      imageGenRequests.set(block.attributes.src, { aspectRatio, blockId: block.id })

                      // Set the image as loading
                      setImageLoading(block.id, true)
                    }
                  }
                }
              }
            }
          }
        }

        if (imageGenRequests.size > 0) {
          // Check if the user has hit their monthly image limit
          const hitLimit = await hasHitImageLimit(FREE_IMAGE_LIMIT)

          // Update the image store with the limit status
          setHasHitLimit(hitLimit)

          // Keep track of all image generation promises
          const imagePromises: Promise<{
            src: string
            prompt: string
            blockId: string
            fromPexels: boolean
          }>[] = []

          if (hitLimit) {
            notifySlack(
              `User ${session.data?.user?.email} has reached monthly AI image limit (${FREE_IMAGE_LIMIT}). Image generation blocked.`,
              'errors'
            )
            logger.debug(`User has reached monthly AI image limit (${FREE_IMAGE_LIMIT}). Using Pexels instead.`)

            // When user has hit limit, still process the image requests but with Pexels
            for (const [prompt, { aspectRatio, blockId }] of imageGenRequests.entries()) {
              // Pass hitLimit as true to use Pexels instead
              const promise = resolveImageSrc(prompt, aspectRatio, true, themeColor || '#8e6ff7')
                .then((src) => {
                  // Mark this image as coming from Pexels
                  markImageAsPexels(blockId)
                  return { src, prompt, blockId, fromPexels: true }
                })
                .catch((error) => {
                  logger.error(`Error resolving fallback Pexels image: ${error}`)
                  // Return a fallback even on error to not block the Promise.all
                  return { src: '', prompt, blockId, fromPexels: true }
                })

              imagePromises.push(promise)
            }
          } else {
            logger.debug(`Found ${imageGenRequests.size} image generation requests in email`)

            // Record each unique image request and start generation
            for (const [prompt, { aspectRatio, blockId }] of imageGenRequests.entries()) {
              await recordAIImageUsage(chatId, prompt)

              // Start the image generation process asynchronously with the appropriate aspect ratio
              const promise = resolveImageSrc(prompt, aspectRatio, false, themeColor || '#8e6ff7')
                .then((src) => {
                  // Check if the URL indicates it's from Pexels (the service fell back to Pexels)
                  const isPexelsUrl = src.includes('pexels.com') || src.includes('pexels-')
                  if (isPexelsUrl) {
                    markImageAsPexels(blockId)
                  }
                  return { src, prompt, blockId, fromPexels: isPexelsUrl }
                })
                .catch((error) => {
                  logger.error(`Error resolving image: ${error}`)
                  // Return a fallback even on error to not block the Promise.all
                  return { src: '', prompt, blockId, fromPexels: false }
                })

              imagePromises.push(promise)
              logger.debug(`Started AI image generation for prompt: ${prompt} with aspect ratio ${aspectRatio}`)
            }
          }

          // Wait for all images to complete
          const resolvedImages = await Promise.all(imagePromises)

          // Update the email with the resolved images
          if (resolvedImages.length > 0) {
            // Create a new email object with the updated image sources
            const updatedEmailObject = {
              ...emailObject,
              rows: emailObject.rows.map((row) => ({
                ...row,
                columns: row.columns.map((column) => ({
                  ...column,
                  blocks: column.blocks.map((block) => {
                    const resolvedImage = resolvedImages.find((img) => img.blockId === block.id)

                    if (resolvedImage && block.type === 'image' && block.attributes && block.attributes.src) {
                      // Update the src with the resolved image
                      return {
                        ...block,
                        attributes: {
                          ...block.attributes,
                          src: resolvedImage.src || block.attributes.src,
                        },
                      }
                    }

                    return block
                  }),
                })),
              })),
            }

            // Save the updated email
            setEmail(updatedEmailObject)
            const updatedEmailContent = generateEmailScript(updatedEmailObject)
            await updateChat(chatId, { email: updatedEmailContent })
            await updateEmailForMessage(chatId, message, updatedEmailObject)

            logger.debug(`Successfully updated email with resolved images`)
          }

          // Mark all images as not loading anymore
          for (const [_, { blockId }] of imageGenRequests.entries()) {
            setImageLoading(blockId, false)
          }
        }
      } catch (error) {
        logger.error(`Error processing email for message ${message.id}:`, error)

        // Make sure to clear any loading states on error
        if (emailObject.rows) {
          for (const row of emailObject.rows) {
            if (row.columns) {
              for (const column of row.columns) {
                if (column.blocks) {
                  for (const block of column.blocks) {
                    if (block.type === 'image' && block.id) {
                      setImageLoading(block.id, false)
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      // Log failure for debugging
      logger.warn(
        `Failed to process email from message ${message.id}: ${
          !emailObject ? 'No email object could be extracted' : 'No chatId available'
        }`
      )

      if (!emailObject) {
        logger.debug('Message content that failed to process:', {
          contentPreview: message.content.substring(0, 200),
          hasEmailTags: message.content.includes('<EMAIL') && message.content.includes('</EMAIL>'),
        })
      }
    }
  }
}
