import { Email } from '../types'

export const blankTemplateScript = `
<EMAIL backgroundColor=#FFFFFF linkColor=#000000>
</EMAIL>
`

export const blankTemplate = (): Email => {
  return {
    preview: 'Blank Template',
    fontFamily: 'Arial, sans-serif',
    width: '600',
    color: '#000000',
    linkColor: '#3b82f6',
    backgroundColor: '#FFFFFF',
    rowBackgroundColor: '#FFFFFF',
    rows: [],
  }
}
