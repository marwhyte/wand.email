import { ebayTemplate } from '@/app/components/email-workspace/ebay-template'
import { goingTemplate } from '@/app/components/email-workspace/going-template'
import { nikeVerificationTemplate } from '@/app/components/email-workspace/nike-verification-template'
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
    case 'ebay':
      return 'Ebay'
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
    case 'ebay':
      template = ebayTemplate
      break
    case 'nike-verification':
      template = nikeVerificationTemplate
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
    case 'socials':
      return {
        ...baseBlock,
        type: 'socials',
        attributes: {
          folder: 'socials-color',

          socialLinks: [
            {
              icon: 'facebook',
              url: 'https://www.facebook.com',
              title: 'Facebook',
              alt: 'Facebook',
            },
            {
              icon: 'instagram',
              url: 'https://www.instagram.com',
              title: 'Instagram',
              alt: 'Instagram',
            },
            {
              icon: 'x',
              url: 'https://www.x.com',
              title: 'X',
              alt: 'X',
            },
          ],
        },
      }
    case 'divider':
      return {
        ...baseBlock,
        type: 'divider',
        attributes: {
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: '#d1d5db',
          paddingTop: '10px',
          paddingBottom: '10px',
        },
      }
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
        attributes: {
          href: '#',
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
        },
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
