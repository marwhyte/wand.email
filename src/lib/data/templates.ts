import { goingTemplate } from '@/app/components/email-workspace/going-template'
import { v4 as uuidv4 } from 'uuid'

export const templates = [
  {
    name: '',
  },
]

export const getTemplateName = (id: string) => {
  switch (id) {
    case 'going':
      return 'Going'
    default:
      break
  }
}
export const getTemplate = (id: string) => {
  let template = null
  switch (id) {
    case 'going':
      template = goingTemplate
      break
    default:
      break
  }
  if (!template) return null

  return template
}

export function createNewBlock(type: EmailBlockType): EmailBlock {
  const baseBlock = {
    id: uuidv4(),
    type,
    content: type === 'button' ? 'Button' : `I'm a new ${type} block`,
    attributes: {},
  }

  switch (baseBlock.type) {
    case 'heading':
      return {
        ...baseBlock,
        type: 'heading',
        attributes: { as: 'h2', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '0', paddingRight: '0' },
      }
    case 'text':
      return {
        ...baseBlock,
        type: 'text',
        attributes: { paddingTop: '10px', paddingBottom: '10px', paddingLeft: '0', paddingRight: '0' },
      }
    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        attributes: {
          src: '',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '0',
          paddingRight: '0',
          width: '100%',
        },
      }
    case 'button':
      return {
        ...baseBlock,
        type: 'button',
        attributes: { href: '#', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '0', paddingRight: '0' },
      }
    case 'link':
      return {
        ...baseBlock,
        type: 'link',
        attributes: { href: '#', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '0', paddingRight: '0' },
      }
    default:
      throw new Error(`Unsupported block type: ${type}`)
  }
}
