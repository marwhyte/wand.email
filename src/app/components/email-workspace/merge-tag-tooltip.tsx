import { Tooltip } from '@/app/components/tooltip'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEffect, useState } from 'react'

type MergeTagType = 'FNAME' | 'LNAME' | 'EMAIL' | 'LIST:ADDRESSLINE' | 'UNSUB' | 'OTHER'

interface MergeTagTooltipProps {
  children: React.ReactElement
  tag: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}

const getMergeTagType = (tag: string): MergeTagType => {
  if (tag.includes('FNAME')) return 'FNAME'
  if (tag.includes('LNAME')) return 'LNAME'
  if (tag.includes('EMAIL')) return 'EMAIL'
  if (tag.includes('LIST:ADDRESSLINE')) return 'LIST:ADDRESSLINE'
  if (tag.includes('UNSUB')) return 'UNSUB'
  return 'OTHER'
}

export const MergeTagTooltip = ({ children, tag, tooltipPosition = 'top' }: MergeTagTooltipProps) => {
  const { exportType, company } = useChatStore()
  const [tooltipContent, setTooltipContent] = useState<string>('')
  const [showValidationWarning, setShowValidationWarning] = useState<boolean>(false)

  useEffect(() => {
    const tagType = getMergeTagType(tag)

    // Base content for different export types
    if (exportType === 'mailchimp') {
      switch (tagType) {
        case 'FNAME':
          setTooltipContent("Will be replaced with the recipient's first name from Mailchimp")
          break
        case 'LNAME':
          setTooltipContent("Will be replaced with the recipient's last name from Mailchimp")
          break
        case 'EMAIL':
          setTooltipContent("Will be replaced with the recipient's email address from Mailchimp")
          break
        case 'LIST:ADDRESSLINE':
          setTooltipContent('Will be replaced with your business address (required for CAN-SPAM compliance)')
          break
        case 'UNSUB':
          setTooltipContent('Will create an unsubscribe link (required for CAN-SPAM compliance)')
          break
        default:
          setTooltipContent(`Mailchimp merge tag: ${tag}`)
      }
      setShowValidationWarning(false)
    } else {
      // HTML or React export types
      switch (tagType) {
        case 'FNAME':
          setTooltipContent("Will be replaced with the recipient's first name in your application")
          break
        case 'LNAME':
          setTooltipContent("Will be replaced with the recipient's last name in your application")
          break
        case 'EMAIL':
          setTooltipContent("Will be replaced with the recipient's email address in your application")
          break
        case 'LIST:ADDRESSLINE':
          if (company?.address) {
            setTooltipContent(`Will be replaced with: "${company.address}"`)
            setShowValidationWarning(false)
          } else {
            setTooltipContent('Company address not set. Click to add your address in Company Settings.')
            setShowValidationWarning(true)
          }
          break
        case 'UNSUB':
          setTooltipContent("You'll need to implement an unsubscribe handler in your application")
          break
        default:
          setTooltipContent(`Merge tag: ${tag}`)
      }
    }
  }, [tag, exportType, company])

  //   const handleClick = (e: React.MouseEvent) => {
  //     const tagType = getMergeTagType(tag)

  //     // Only for address tag and if company address is missing
  //     if (tagType === 'LIST:ADDRESSLINE' && !company?.address && (exportType === 'html' || exportType === 'react')) {
  //       e.stopPropagation()
  //       openCompanyDialog()
  //     }
  //   }

  const tooltipId = `merge-tag-tooltip-${tag.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <Tooltip id={tooltipId} place={tooltipPosition} content={tooltipContent}>
      <div className="inline-block">
        {children}
        {showValidationWarning && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-red-500" />}
      </div>
    </Tooltip>
  )
}
