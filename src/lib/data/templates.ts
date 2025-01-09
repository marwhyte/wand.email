import { ebayTemplate } from '@/app/components/email-workspace/templates/ebay-template'
import { goingTemplate } from '@/app/components/email-workspace/templates/going-template'
import { nikeVerificationTemplate } from '@/app/components/email-workspace/templates/nike-verification-template'
import { slackTemplate } from '@/app/components/email-workspace/templates/slack-template'
import { stripeTemplate } from '@/app/components/email-workspace/templates/stripe-template'
import { turbotaxTemplate } from '@/app/components/email-workspace/templates/turbotax-template'
import { getImgFromKey } from '@/lib/utils/misc'
import { v4 as uuidv4 } from 'uuid'
import { getFile } from '../database/queries/files'

export const templates: Template[] = [
  {
    name: 'Going',
    id: 'going',
    description: 'Marketing emails for flight deals',
    template: goingTemplate(),
    types: ['ecommerce', 'recommended'],
  },
  {
    name: 'Ebay',
    id: 'ebay',
    description: 'Back to school shopping',
    template: ebayTemplate,
    types: ['ecommerce', 'recommended'],
  },
  {
    name: 'Nike Verification',
    id: 'nike-verification',
    description: 'Verification code email',
    template: nikeVerificationTemplate(),
    types: ['transactional', 'recommended'],
  },
  {
    name: 'Stripe',
    id: 'stripe',
    description: 'Product updates',
    template: stripeTemplate(),
    types: ['newsletter', 'recommended'],
  },
  {
    name: 'Slack',
    id: 'slack',
    description: 'Membership ended',
    template: slackTemplate(),
    types: ['transactional', 'recommended'],
  },
  {
    name: 'TurboTax',
    id: 'turbotax',
    description: 'Tax preparation reminder',
    template: turbotaxTemplate(),
    types: ['transactional', 'recommended'],
  },
]

export const templateTypes: TemplateTypes[] = [
  'personalized',
  'recommended',
  'ecommerce',
  'transactional',
  'welcome-series',
  'newsletter',
]

export const getTemplateName = (id: string) => {
  const template = templates.find((template) => template.id === id)
  return template?.name || null
}
export const getTemplate = (id: string, config?: Partial<TemplateConfig>): Email | null => {
  const template = templates.find((template) => template.id === id)
  if (!template) return null

  if (config) {
    switch (template.id) {
      case 'going':
        return goingTemplate()
      default:
        return template.template
    }
  }

  return template.template
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
          borderColor: '#E0E0E0',
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

export async function getTemplateConfig(params: {
  user?: {
    primary_color?: string | null
    secondary_color?: string | null
    logo_file_id?: string | null
  } | null
  useLocalStorage?: boolean
}): Promise<TemplateConfig> {
  const { user, useLocalStorage = true } = params

  const logoFileId = user?.logo_file_id || (useLocalStorage ? localStorage.getItem('logoFileId') : null) || null

  let logoFile = undefined

  if (logoFileId) {
    logoFile = await getFile(logoFileId)
  }

  return {
    colors: {
      primary: user?.primary_color || (useLocalStorage ? localStorage.getItem('primaryColor') : null) || null,
      secondary: user?.secondary_color || (useLocalStorage ? localStorage.getItem('secondaryColor') : null) || null,
    },
    companyName: null,
    logoUrl: getImgFromKey(logoFile?.image_key ?? ''),
  }
}
