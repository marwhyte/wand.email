import { TextBlockAttributes } from '../../types'

export type ToolbarProps = {
  style?: React.CSSProperties
}

export type ToolbarState = {
  bold: boolean
  italic: boolean
  underline: boolean
  link: boolean
}

export type FormattingButtonProps = {
  active: boolean
  onClick: (e: React.MouseEvent) => void
  icon: React.ReactNode
}

export type TextControlsProps = {
  fontSize: number
  fontWeight: string
  color: string
  onChange: (attributes: Partial<TextBlockAttributes>) => void
}

export type AlignmentControlsProps = {
  textAlign: 'left' | 'center' | 'right'
  onChange: (value: 'left' | 'center' | 'right') => void
}

export type LineHeightControlsProps = {
  lineHeight: string
  onChange: (value: string) => void
}

export type LinkInputProps = {
  isVisible: boolean
  isEditing: boolean
  initialUrl?: string
  onClose: () => void
  onSubmit: (url: string) => void
}
