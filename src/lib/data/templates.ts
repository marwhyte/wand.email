import { ebayTemplate } from '@/app/components/email-workspace/templates/ebay-template'
import { goingTemplate } from '@/app/components/email-workspace/templates/going-template'
import { nikeVerificationTemplate } from '@/app/components/email-workspace/templates/nike-verification-template'
import { slackTemplate } from '@/app/components/email-workspace/templates/slack-template'
import { stripeTemplate } from '@/app/components/email-workspace/templates/stripe-template'
import { turbotaxTemplate } from '@/app/components/email-workspace/templates/turbotax-template'
import {
  ButtonBlock,
  DividerBlock,
  Email,
  EmailBlock,
  EmailBlockType,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  SocialsBlock,
  SurveyBlock,
  Template,
  TemplateTypes,
  TextBlock,
} from '@/app/components/email-workspace/types'
import { v4 as uuidv4 } from 'uuid'

export const templates: Template[] = [
  {
    name: 'Going',
    id: 'going',
    description: 'Marketing emails for flight deals',
    template: goingTemplate,
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
export const getTemplate = (id: string): Email | null => {
  const template = templates.find((template) => template.id === id)
  if (!template) return null

  return template.template
}

export function createNewBlock<T extends EmailBlockType>(type: T): Extract<EmailBlock, { type: T }> {
  const baseBlock = {
    id: uuidv4(),
    type,
  }

  switch (type) {
    case 'survey': {
      const block: SurveyBlock = {
        ...baseBlock,
        type: 'survey',
        attributes: {
          kind: 'rating',
          question: 'How was your experience?',
        },
      }
      return block as Extract<EmailBlock, { type: T }>
    }

    case 'socials': {
      const block: SocialsBlock = {
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
      return block as Extract<EmailBlock, { type: T }>
    }

    case 'divider': {
      const block: DividerBlock = {
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
      return block as Extract<EmailBlock, { type: T }>
    }

    case 'heading': {
      const block: HeadingBlock = {
        ...baseBlock,
        type: 'heading',
        attributes: {
          level: 'h2',
          content: `I'm a new heading block`,
        },
      }
      return block as Extract<EmailBlock, { type: T }>
    }

    case 'text': {
      const block: TextBlock = {
        ...baseBlock,
        type: 'text',
        attributes: {
          content: `I'm a new text block`,
        },
      }
      return block as Extract<EmailBlock, { type: T }>
    }

    case 'image': {
      const block: ImageBlock = {
        ...baseBlock,
        type: 'image',
        attributes: {
          src: '',
          alt: '',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '0',
          paddingRight: '0',
          width: '100%',
        },
      }
      return block as Extract<EmailBlock, { type: T }>
    }

    case 'button': {
      const block: ButtonBlock = {
        ...baseBlock,
        type: 'button',
        attributes: {
          content: 'Button',
          href: '#',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          paddingTop: '12px',
          paddingBottom: '12px',
          paddingLeft: '20px',
          paddingRight: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '4px',
        },
      }
      return block as Extract<EmailBlock, { type: T }>
    }

    case 'link': {
      const block: LinkBlock = {
        ...baseBlock,
        type: 'link',
        attributes: {
          content: `I'm a new link block`,
          href: '#',
        },
      }
      return block as Extract<EmailBlock, { type: T }>
    }

    default: {
      const _exhaustiveCheck: never = type
      throw new Error(`Unsupported block type: ${type}`)
    }
  }
}
