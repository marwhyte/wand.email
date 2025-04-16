import { BoldIcon, ItalicIcon, LinkIcon, UnderlineIcon } from '@heroicons/react/24/outline'
import { FormattingButtonProps } from './types'

const FormattingButton = ({ active, onClick, icon }: FormattingButtonProps) => (
  <button className={`rounded p-1 hover:bg-gray-100 ${active ? 'bg-gray-100' : ''}`} onClick={onClick}>
    {icon}
  </button>
)

export const FormattingControls = ({
  bold,
  italic,
  underline,
  link,
  showLinkButton,
  onFormatClick,
  onLinkClick,
}: {
  bold: boolean
  italic: boolean
  underline: boolean
  link: boolean
  showLinkButton: boolean
  onFormatClick: (type: 'bold' | 'italic' | 'underline') => void
  onLinkClick: (e: React.MouseEvent) => void
}) => {
  return (
    <>
      <FormattingButton
        active={bold}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onFormatClick('bold')
        }}
        icon={<BoldIcon className="h-4 w-4" />}
      />
      <FormattingButton
        active={italic}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onFormatClick('italic')
        }}
        icon={<ItalicIcon className="h-4 w-4" />}
      />
      <FormattingButton
        active={underline}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onFormatClick('underline')
        }}
        icon={<UnderlineIcon className="h-4 w-4" />}
      />
      {showLinkButton && (
        <button
          className={`rounded p-1 ${link ? 'bg-purple-100 text-purple-800' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={onLinkClick}
          title="Link"
          data-link-button="true"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      )}
    </>
  )
}
