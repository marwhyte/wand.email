'use server'

import { Email } from '@/app/components/email-workspace/types'
import { auth } from '@/auth'
import { getMessageId } from '@/lib/utils/misc'
import type { Message } from 'ai'
import { db } from '../db'

export async function createChat({
  id,
  messages = [],
  title = '',
  email = null,
  companyId = null,
}: {
  id: string
  messages?: Message[]
  title?: string
  email?: Email | null
  companyId?: string | null
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  return await db.transaction().execute(async (trx) => {
    // Create chat
    const chat = await trx
      .insertInto('chats')
      .values({
        id,
        user_id: session?.user?.id ?? '',
        title: title ?? '',
        email,
        company_id: companyId,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirst()

    if (!chat) throw new Error('Failed to create chat')

    // Insert messages
    if (messages.length > 0) {
      await trx
        .insertInto('messages')
        .values(
          messages.map((msg, index) => ({
            chat_id: chat.id,
            role: msg.role,
            content: msg.content,
            sequence: index,
            created_at: new Date(),
          }))
        )
        .execute()
    }

    return chat
  })
}

export async function updateMessage(id: string, chatId: string, updates: { content?: string; email?: Email }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  if (updates.content !== undefined) {
    await db
      .updateTable('messages')
      .set({ content: updates.content })
      .where('id', '=', id)
      .where('chat_id', '=', chatId)
      .execute()
  }

  if (updates.email !== undefined) {
    await db
      .updateTable('messages')
      .set({ email: updates.email })
      .where('id', '=', id)
      .where('chat_id', '=', chatId)
      .execute()
  }
}

export async function deleteMessagesAfterId(id: string, chatId: string) {
  // Retrieve the created_at timestamp of the message with the given id
  const message = await db
    .selectFrom('messages')
    .select('created_at')
    .where('id', '=', id)
    .where('chat_id', '=', chatId)
    .executeTakeFirst()

  if (!message) {
    throw new Error('Message not found')
  }

  // Delete messages created after the retrieved timestamp
  await db.deleteFrom('messages').where('created_at', '>', message.created_at).where('chat_id', '=', chatId).execute()

  return await db
    .selectFrom('messages')
    .selectAll()
    .where('chat_id', '=', chatId)
    .orderBy('created_at', 'asc')
    .execute()
}

export async function updateChat(
  id: string,
  updates: { messages?: Message[]; title?: string; email?: Email; previousEmail?: Email; parsed?: boolean }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    return await db.transaction().execute(async (trx) => {
      // Update chat
      if (updates.title !== undefined) {
        await trx
          .updateTable('chats')
          .set({
            title: updates.title,
            updated_at: new Date(),
          })
          .where('id', '=', id)
          .where('user_id', '=', session.user?.id ?? '')
          .execute()
      }

      if (updates.email) {
        await trx
          .updateTable('chats')
          .set({
            email: updates.email,
            updated_at: new Date(),
          })
          .where('id', '=', id)
          .where('user_id', '=', session.user?.id ?? '')
          .execute()
      }

      if (updates.previousEmail) {
        await trx
          .updateTable('chats')
          .set({ previous_email: updates.previousEmail })
          .where('id', '=', id)
          .where('user_id', '=', session.user?.id ?? '')
          .execute()
      }

      // Update messages
      if (updates.messages) {
        // Get existing messages to preserve created_at for existing messages
        const existingMessages = await trx
          .selectFrom('messages')
          .select(['id', 'created_at', 'email'])
          .where('chat_id', '=', id)
          .execute()

        // Create a map of existing message IDs to their created_at timestamps
        const existingMessageMap = new Map(
          existingMessages.map((msg) => [msg.id, { created_at: msg.created_at, email: msg.email }])
        )

        // Delete existing messages
        await trx.deleteFrom('messages').where('chat_id', '=', id).execute()

        // Sort messages by creation time
        const sortedMessages = [...updates.messages].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return timeA - timeB
        })

        // Prepare message values with sequential ordering
        const messageValues = sortedMessages.map((msg, index) => {
          // For created_at, ensure we're using consistent UTC dates
          let created_at: Date = new Date()
          if (existingMessageMap.get(msg.id)) {
            // Use existing timestamp from database
            created_at = existingMessageMap.get(msg.id)?.created_at as Date
          } else if (msg.createdAt) {
            // Convert provided timestamp to a Date object
            created_at = new Date(msg.createdAt)
          } else {
            // Create a new UTC timestamp
            created_at = new Date()
          }

          const email = existingMessageMap.get(msg.id)?.email ?? null

          // Generate a UUID if the message ID doesn't match UUID format
          // This handles IDs like "msg-7WwZKPfuDXRErECZ4uIXvpLw"

          const messageId = getMessageId(msg)

          return {
            chat_id: id,
            role: msg.role,
            content: msg.content,
            sequence: index,
            id: messageId,
            created_at,
            email,
          }
        })

        // Insert new messages
        await trx.insertInto('messages').values(messageValues).returningAll().execute()
      }
    })
  } catch (error) {
    console.error('Error updating chat:', error)
    throw error
  }
}

export async function deleteChat(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    const result = await db
      .updateTable('chats')
      .set({ deleted_at: new Date() })
      .where('id', '=', id)
      .where('user_id', '=', session.user.id)
      .executeTakeFirst()

    return result !== undefined
  } catch (error) {
    console.error('Error deleting chat:', error)
    return false
  }
}

export async function getChats() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const chats = await db
    .selectFrom('chats')
    .selectAll()
    .where('user_id', '=', session.user.id)
    .where('deleted_at', 'is', null)
    .orderBy('updated_at', 'desc')
    .execute()

  return chats
}

export async function getMessage(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const message = await db.selectFrom('messages').selectAll().where('id', '=', id).executeTakeFirst()
  return message
}

export async function getChat(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const chat = await db
    .selectFrom('chats')
    .selectAll()
    .where('id', '=', id)
    .where('user_id', '=', session.user.id)
    .where('deleted_at', 'is', null)
    .executeTakeFirst()
  return chat
}

export async function getChatWithMessages(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const chat = await db
    .selectFrom('chats')
    .selectAll()
    .where('id', '=', id)
    .where('user_id', '=', session.user.id)
    .where('deleted_at', 'is', null)
    .executeTakeFirst()

  if (!chat) return undefined

  const messages = await db
    .selectFrom('messages')
    .selectAll()
    .where('chat_id', '=', id)
    .orderBy('sequence', 'asc')
    .execute()

  const response = {
    ...chat,
    messages: messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      sequence: msg.sequence,
      created_at: msg.created_at,
      content: msg.content,
      email: msg.email,
    })),
  }

  return response
}
