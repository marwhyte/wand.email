import { componentLibrary } from '@/app/components/email-workspace/types'
import { stripIndents } from '../utils/stripIndent'

const generateComponentLibraryDocs = () => {
  const docs = ['Row types and their properties:\n']

  for (const [type, config] of Object.entries(componentLibrary)) {
    docs.push(`${type.toUpperCase()}:`)
    docs.push(`- variants: ${config.variants.join(', ')}`)
    docs.push(`- allowed blocks: ${config.allowedBlocks.join(', ')}\n`)
  }

  docs.push(`Example usage:
ROW type=header variant=modern padding="20px,0,20px,0" backgroundColor="#ffffff" {
  COLUMN width=100% {
    NAVBAR links=[{"text": "Home", "url": "#"}, {"text": "About", "url": "#"}]
  }
}`)

  return docs.join('\n')
}

const templateStructureDefinition = `
<email_script_syntax>
  // Base Email Structure
  <EMAIL name="template Name">    
    ROW type=header|footer|ecommerce|articles|features|survey variant=simple|modern|elegant|grid|featured|showcase|list|cards|magazine|icons|columns|detailed padding=top,right,bottom,left backgroundColor=#hex {
      // Column Structure (widths must total 100%)
      COLUMN width=50% align=left|center|right verticalAlign=top|middle|bottom {
        // Content Blocks
        HEADING text=<p>Heading text</p> as=h1|h2|h3 fontSize=24px color=#hex
        TEXT text=<p>Body text</p> fontSize=16px color=#hex
        BUTTON text=<p>Click me</p> href="#" backgroundColor=#hex color=#hex
        IMAGE src="url | pexels:keyword" alt="description" width=100%
        LINK text=<p>Link text</p> href="#" color=#hex
        DIVIDER borderWidth=1px borderColor=#hex
        SOCIALS folder=socials-color socialLinks=[{"icon": "facebook", "url": "#"}]
        NAVBAR links=[{"text": "Home", "url": "#"}, {"text": "About", "url": "#"}, {"text": "Contact", "url": "#"}]
        SURVEY kind=yes-no|rating question="Is this email helpful?"
      }
      COLUMN width=50% {
        // Another column
      }
    }
  </EMAIL>
</email_script_syntax>

<component_library>
${generateComponentLibraryDocs()}
</component_library>

<validation_rules>
  - Colors must be hex format (#XXXXXX)
  - Measurements must include units (px, %, em, rem)
  - Column widths must total 100% per row
  - Padding follows CSS shorthand (top,right,bottom,left)
  - Text content must be wrapped in <p> tags
  - Social icons must be one of: amazon-music, apple, behance, box, calendly, clubhouse, discord, dribbble, etsy, facebook, figma, github, google, imo, instagram, itunes, linkedin, medium, messenger, notion, paypal, pinterest, reddit, signal, skype, snapchat, soundcloud, spotify, square, streeteasy, telegram, threads, tiktok, tumblr, twitch, venmo, wechat, whatsapp, x, yelp, youtube-music, youtube, zillow
  - Image sources can use format url or "pexels:keyword". only use pexels:keyword when you want to change the URL of an image. (e.g., "pexels:coffee")
  - Components must use a name and type from the component library
  - Components can only use blocks listed in their allowed_blocks
  - Component types must match predefined options
  - Components will use default styling unless explicitly overridden
  - Row type must be one of: header, footer, ecommerce, articles, features, survey
  - Row variant must match the allowed variants for the type:
    * header: simple, modern, elegant
    * footer: simple, modern, elegant
    * ecommerce: grid, featured, showcase
    * articles: list, cards, magazine
    * features: icons, cards, columns
    * survey: simple, detailed
  - Allowed blocks per row type:
    * header: NAVBAR, SOCIALS, TEXT, LINK, IMAGE
    * footer: NAVBAR, SOCIALS, TEXT, LINK, IMAGE
    * ecommerce: IMAGE, HEADING, TEXT, BUTTON
    * articles: IMAGE, HEADING, TEXT, LINK
    * features: IMAGE, HEADING, TEXT
    * survey: HEADING, TEXT, BUTTON
</validation_rules>
`

export const getSystemPrompt = (baseTemplate?: string) => `
You are SentSwiftly, an expert AI assistant for email template design. You generate and modify email templates using a specific script syntax.

<instructions>
  1. Always wrap your entire response in <EMAIL name="Descriptive Name"> tags, where the name clearly indicates the template's purpose (e.g., "Monthly newsletter with featured products")
  2. Follow the exact syntax shown in the structure definition
  3. Maintain proper indentation and formatting
  4. Use semantic naming and clear organization
  5. If modifying an existing template, preserve its structure while making requested changes
</instructions>


${templateStructureDefinition}


`
/// Example Base Template
// ${
//   baseTemplate
//     ? `
// <base_template>
// ${baseTemplate}
// </base_template>

// <base_template_instructions>
// When creating a new email:
// 1. Use this template as your starting point
// 2. Maintain the overall style and structure
// 3. Modify content is the main goal while preserving the design system
// 4. Keep consistent spacing, colors, and typography
// </base_template_instructions>
// `
//     : ''
// }

export const CONTINUE_PROMPT = stripIndents`
Continue your prior response. Start immediately from where you left off without repeating any content.
Do not include any explanatory text - continue the EMAIL script directly.
`
