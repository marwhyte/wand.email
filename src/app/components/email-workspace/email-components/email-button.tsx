import { applyCommonAttributes } from '@/lib/utils/misc'
import { Button } from '@react-email/components'
import parse from 'html-react-parser'

type Props = {
  block: ButtonBlock
  isEditing: boolean
}

export default function EmailButton({ block, isEditing }: Props) {
  const defaultStyles = {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  }

  return (
    <Button
      href={isEditing ? undefined : block.attributes.href}
      target={block.attributes.target}
      rel={block.attributes.rel}
      style={{
        ...defaultStyles,
        ...applyCommonAttributes(block.attributes),
        display: 'inline-block',
      }}
    >
      {parse(block.content)}
    </Button>
  )
}
