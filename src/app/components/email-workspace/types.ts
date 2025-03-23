export const FOLDERS: { name: SocialIconFolders; title: string }[] = [
  {
    name: 'socials-blue',
    title: 'Blue',
  },
  {
    name: 'socials-color',
    title: 'Color',
  },
  {
    name: 'socials-dark-gray',
    title: 'Dark Gray',
  },
  {
    name: 'socials-dark-round',
    title: 'Dark Round',
  },
  {
    name: 'socials-dark',
    title: 'Dark',
  },
  {
    name: 'socials-outline-color',
    title: 'Outline Color',
  },
  {
    name: 'socials-outline-gray',
    title: 'Outline Gray',
  },
  {
    name: 'socials-outline-white',
    title: 'Outline White',
  },
  {
    name: 'socials-white',
    title: 'White',
  },
]

export const componentLibrary = {
  header: {
    example: `
      <ROW type="header">
        <COLUMN>
          <IMAGE src="logo" alt="Logo" />
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  footer: {
    note: 'The footer should always have a logo, social media links, and address unless otherwise specified.',
    example: `
      <ROW type="footer">
        <COLUMN>
          <IMAGE src="logo" alt="Logo" />
          <TEXT>Company Name</TEXT>
          <SOCIALS folder="socials-color">
            <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
            <SOCIAL icon="x" url="#" title="X" alt="X" />
            <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
          </SOCIALS>
          <TEXT>123 Main Street Anytown, CA 12345<br>United States</TEXT>
          <TEXT>mail@company.com</TEXT>
          <TEXT>© 2024 Company Name. All rights reserved.</TEXT>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  gallery: {
    example: `
      <ROW type="gallery">
        <COLUMN>
          <IMAGE src="pexels:bed in a room" alt="Bed in room" />
        </COLUMN>
        <COLUMN>
          <HEADING level="h2">Deck out your dorm</HEADING>
          <TEXT>Own your space with decor, home essentials, and more.</TEXT>
          <BUTTON href="/">Start designing</BUTTON>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'LINK'],
  },
} as const

export const blockLibrary = {
  BUTTON: {
    attributes: {
      align: ['left', 'center', 'right'],
      backgroundColor: ['#000000'],
      borderColor: ['#000000'],
      borderRadius: ['4'],
      borderStyle: ['solid', 'dashed', 'dotted'],
      borderWidth: ['1'],
      contentPadding: ['10,0,10,0'],
      color: ['#ffffff'],
      fontWeight: ['normal', 'bold'],
      fontSize: ['16'],
      padding: ['10,0,10,0'],
      href: ['#'],
    },
  },
  DIVIDER: {
    attributes: {
      borderStyle: ['solid', 'dashed', 'dotted'],
      borderWidth: ['1'],
      borderColor: ['#dddddd'],
      padding: ['10,0,10,0'],
    },
  },
  HEADING: {
    attributes: {
      level: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      textAlign: ['left', 'center', 'right'],
      color: ['#000000'],
      fontWeight: ['bold'],
      fontSize: ['18'],
      lineHeight: ['1.2'],
      padding: ['10,0,10,0'],
    },
  },
  IMAGE: {
    note: 'Use pexels:keywords to search for images on pexels.com. Use logo to use the company logo. Use https://images.pexels.com/photos/example.png to use a placeholder image.',
    attributes: {
      align: ['left', 'center', 'right'],
      alt: ['Image description'],
      borderRadius: ['8'],
      src: ['logo', 'pexels:keywords', 'https://images.pexels.com/photos/example.png'],
      width: ['100%', '50%'],
      padding: ['10,0,10,0'],
    },
  },
  LINK: {
    attributes: {
      align: ['left', 'center', 'right'],
      href: ['#'],
      color: ['#0000FF'],
      fontWeight: ['normal', 'bold'],
      fontSize: ['16'],
      padding: ['5,0,5,0'],
    },
  },
  LIST: {
    note: "Use LI elements to define list items. If type is icon, pick an icon that is relevant to the content. You can use any icon from google's material symbols.",
    attributes: {
      padding: ['10,0,10,0'],
      type: ['ul', 'ol', 'icon'],
      icons: ['check'],
    },
  },
  SOCIALS: {
    note: 'Use SOCIAL child elements to define individual social icons.',
    attributes: {
      align: ['left', 'center', 'right'],
      folder: FOLDERS.map((folder) => folder.name),
      padding: ['10,0,10,0'],
    },
  },
  SOCIAL: {
    attributes: {
      icon: ['facebook', 'x', 'instagram', 'linkedin', 'youtube'],
      url: ['#'],
      title: ['Facebook', 'X', 'Instagram'],
      alt: ['Facebook', 'X', 'Instagram'],
    },
  },
  SURVEY: {
    attributes: {
      color: ['#000000'],
      kind: ['yes-no', 'rating'],
      question: ['How would you rate your experience?'],
      padding: ['10,0,10,0'],
    },
  },
  TABLE: {
    note: 'Use TR elements for rows and TD elements for cells within the table.',
    attributes: {
      align: ['left', 'center', 'right'],
      padding: ['10,0,10,0'],
    },
  },
  TEXT: {
    attributes: {
      textAlign: ['left', 'center', 'right'],
      color: ['#000000'],
      fontWeight: ['normal', 'bold'],
      fontSize: ['16'],
      lineHeight: ['1.5'],
      letterSpacing: ['normal'],
      padding: ['10,0,10,0'],
    },
  },
}

// Type for component types
export type ComponentType = keyof typeof componentLibrary

// Type for allowed blocks based on component type
export type AllowedBlocks<T extends ComponentType> = (typeof componentLibrary)[T]['allowedBlocks'][number]

export type EmailStyleVariant = 'default' | 'outline' | 'floating'
export const emailStyleVariants = ['default', 'outline', 'floating'] as const
export type EmailType =
  | 'default'
  | 'welcome-series'
  | 'ecommerce'
  | 'invite'
  | 'transactional'
  | 'newsletter'
  | 'invoice'
  | 'cart'
export const emailTypes = [
  'default',
  'welcome-series',
  'ecommerce',
  'invite',
  'transactional',
  'newsletter',
  'invoice',
  'cart',
] as const

export type Email = {
  backgroundColor?: string
  color?: string
  fontFamily?: string
  id: string
  linkColor?: string
  preview?: string
  rowBackgroundColor?: string
  rows: RowBlock[]
  width?: string
  styleVariant?: EmailStyleVariant
  type?: EmailType
}

export type TemplateTypes =
  | 'personalized'
  | 'recommended'
  | 'ecommerce'
  | 'transactional'
  | 'welcome-series'
  | 'newsletter'

interface TemplateConfig {
  logoUrl: string | null
  colors: {
    primary: string | null
    secondary: string | null
  }
  companyName: string | null
}

export type RequiredTemplateConfig = {
  [K in keyof TemplateConfig]: TemplateConfig[K] extends { [key: string]: string | null }
    ? { [P in keyof TemplateConfig[K]]: NonNullable<TemplateConfig[K][P]> }
    : NonNullable<TemplateConfig[K]>
}

export type Template = {
  name: string
  id: string
  description: string
  template: Email
  types: TemplateTypes[]
}

// ===== Core Block Types =====
export type EmailBlock =
  | ButtonBlock
  | DividerBlock
  | HeadingBlock
  | ImageBlock
  | LinkBlock
  | ListBlock
  | SocialsBlock
  | TableBlock
  | SurveyBlock
  | TextBlock
export type EmailBlockType = EmailBlock['type']

// ===== Structural Blocks =====
export type RowBlock = {
  id: string
  type: 'row'
  attributes: RowBlockAttributes
  columns: ColumnBlock[]
}

export type ColumnBlock = {
  id: string
  type: 'column'
  attributes: ColumnBlockAttributes
  blocks: EmailBlock[]
}

// ===== Content Blocks =====
export type ButtonBlock = {
  id: string
  type: 'button'
  attributes: ButtonBlockAttributes
}

export type DividerBlock = {
  id: string
  type: 'divider'
  attributes: DividerBlockAttributes
}

export type HeadingBlock = {
  id: string
  type: 'heading'
  attributes: HeadingBlockAttributes
}

export type ImageBlock = {
  id: string
  type: 'image'
  attributes: ImageBlockAttributes
}

export type LinkBlock = {
  id: string
  type: 'link'
  attributes: LinkBlockAttributes
}

export type ListBlock = {
  id: string
  type: 'list'
  attributes: ListBlockAttributes
}

export type SocialsBlock = {
  id: string
  type: 'socials'
  attributes: SocialsBlockAttributes
}

export type SurveyBlock = {
  id: string
  type: 'survey'
  attributes: SurveyBlockAttributes
}

export type TableBlock = {
  id: string
  type: 'table'
  attributes: TableBlockAttributes
}

export type TextBlock = {
  id: string
  type: 'text'
  attributes: TextBlockAttributes
}

// ===== Base Attribute Types =====
export type PaddingAttributes = {
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
}

export type TextAttributes = {
  color?: string
  content: string
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder'
  fontSize?: string
  fontFamily?: string
  letterSpacing?: string
  lineHeight?: string
}

// ===== Structural Block Attributes =====
export type RowBlockAttributes = PaddingAttributes & {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderWidth?: string
  columnSpacing?: number
  hideOnMobile?: boolean
  stackOnMobile?: boolean
  type?: ComponentType
  verticalAlign?: 'top' | 'middle' | 'bottom'
}

export type ColumnBlockAttributes = {
  width?: string
}

// ===== Block-Specific Attributes =====
export type ButtonBlockAttributes = TextAttributes &
  PaddingAttributes & {
    align?: 'left' | 'center' | 'right'
    backgroundColor?: string
    borderColor?: string
    borderRadius?: string
    borderStyle?: 'solid' | 'dashed' | 'dotted'
    borderWidth?: string
    href: string
    contentPaddingBottom?: string
    contentPaddingLeft?: string
    contentPaddingRight?: string
    contentPaddingTop?: string
  }

export type DividerBlockAttributes = PaddingAttributes & {
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderWidth?: string
  borderColor?: string
}

export type HeadingBlockAttributes = TextAttributes &
  PaddingAttributes & {
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    textAlign?: 'left' | 'center' | 'right'
  }

export type ImageBlockAttributes = PaddingAttributes & {
  align?: 'left' | 'center' | 'right'
  alt: string
  borderRadius?: string
  src: string
  width?: string
}

export type LinkBlockAttributes = TextAttributes &
  PaddingAttributes & {
    align?: 'left' | 'center' | 'right'
    href: string
  }

export type ListBlockAttributes = Omit<TextAttributes, 'content'> &
  PaddingAttributes & {
    items: string[]
    icons?: string[]
    type: 'ul' | 'ol' | 'icon'
  }

export type SocialsBlockAttributes = PaddingAttributes & {
  align?: 'left' | 'center' | 'right'
  folder: SocialIconFolders
  links: {
    alt: string
    icon: SocialIconName
    title: string
    url: string
  }[]
}

export type SurveyBlockAttributes = PaddingAttributes & {
  color?: string
  kind: 'yes-no' | 'rating'
  links?: {
    'yes-no': {
      no: string
      yes: string
    }
    rating: {
      1: string
      2: string
      3: string
      4: string
      5: string
    }
  }
  question: string
}

export type TableBlockAttributes = PaddingAttributes & {
  rows: string[][]
}
export type TextBlockAttributes = TextAttributes &
  PaddingAttributes & {
    textAlign?: 'left' | 'center' | 'right'
  }

export type SocialIconFolders =
  | 'socials-blue'
  | 'socials-color'
  | 'socials-dark-gray'
  | 'socials-dark-round'
  | 'socials-dark'
  | 'socials-outline-black'
  | 'socials-outline-color'
  | 'socials-outline-gray'
  | 'socials-outline-white'
  | 'socials-white'

export type SocialIconName =
  | 'amazon-music'
  | 'apple'
  | 'behance'
  | 'box'
  | 'calendly'
  | 'clubhouse'
  | 'discord'
  | 'dribbble'
  | 'etsy'
  | 'facebook'
  | 'figma'
  | 'github'
  | 'google'
  | 'imo'
  | 'instagram'
  | 'itunes'
  | 'linkedin'
  | 'medium'
  | 'messenger'
  | 'notion'
  | 'paypal'
  | 'pinterest'
  | 'reddit'
  | 'signal'
  | 'skype'
  | 'snapchat'
  | 'soundcloud'
  | 'spotify'
  | 'square'
  | 'streeteasy'
  | 'telegram'
  | 'threads'
  | 'tiktok'
  | 'tumblr'
  | 'twitch'
  | 'venmo'
  | 'wechat'
  | 'whatsapp'
  | 'x'
  | 'yelp'
  | 'youtube-music'
  | 'youtube'
  | 'zillow'

// Common icons that appear in ALL folders
export const COMMON_SOCIAL_ICONS = {
  apple: 'apple.png',
  clubhouse: 'clubhouse.png',
  discord: 'discord.png',
  dribbble: 'dribbble.png',
  facebook: 'facebook.png',
  figma: 'figma.png',
  github: 'github.png',
  google: 'google.png',
  instagram: 'instagram.png',
  linkedin: 'linkedin.png',
  medium: 'medium.png',
  messenger: 'messenger.png',
  pinterest: 'pinterest.png',
  reddit: 'reddit.png',
  signal: 'signal.png',
  snapchat: 'snapchat.png',
  spotify: 'spotify.png',
  telegram: 'telegram.png',
  threads: 'threads.png',
  tiktok: 'tiktok.png',
  twitch: 'twitch.png',
  whatsapp: 'whatsapp.png',
  x: 'x.png',
  youtube: 'youtube.png',
} as const

// Additional icons specific to each folder
// export const FOLDER_SPECIFIC_ICONS = {
//   'socials-blue': {
//     'amazon-music': 'amazon-music.png',
//     behance: 'behance.png',
//     box: 'box.png',
//     calendly: 'calendly.png',
//     etsy: 'etsy.png',
//     imo: 'imo.png',
//     itunes: 'itunes.png',
//     notion: 'notion.png',
//     paypal: 'paypal.png',
//     skype: 'skype.png',
//     soundcloud: 'soundcloud.png',
//     square: 'square.png',
//     streeteasy: 'streeteasy.png',
//     venmo: 'venmo.png',
//     wechat: 'wechat.png',
//     yelp: 'yelp.png',
//   },
//   'socials-color': {
//     'amazon-music': 'amazon-music.png',
//     behance: 'behance.png',
//     box: 'box.png',
//     calendly: 'calendly.png',
//     etsy: 'etsy.png',
//     imo: 'imo.png',
//     itunes: 'itunes.png',
//     notion: 'notion.png',
//     paypal: 'paypal.png',
//     skype: 'skype.png',
//     soundcloud: 'soundcloud.png',
//     square: 'square.png',
//     streeteasy: 'streeteasy.png',
//     venmo: 'venmo.png',
//     wechat: 'wechat.png',
//     yelp: 'yelp.png',
//   },
//   'socials-dark-gray': {
//     'amazon-music': 'amazon-music.png',
//     behance: 'behance.png',
//     box: 'box.png',
//     calendly: 'calendly.png',
//     etsy: 'etsy.png',
//     imo: 'imo.png',
//     itunes: 'itunes.png',
//     notion: 'notion.png',
//     paypal: 'paypal.png',
//     skype: 'skype.png',
//     soundcloud: 'soundcloud.png',
//     square: 'square.png',
//     streeteasy: 'streeteasy.png',
//     venmo: 'venmo.png',
//     wechat: 'wechat.png',
//     yelp: 'yelp.png',
//   },
//   'socials-dark': {
//     'amazon-music': 'amazon-music.png',
//     behance: 'behance.png',
//     box: 'box.png',
//     calendly: 'calendly.png',
//     etsy: 'etsy.png',
//     imo: 'imo.png',
//     itunes: 'itunes.png',
//     notion: 'notion.png',
//     paypal: 'paypal.png',
//     skype: 'skype.png',
//     soundcloud: 'soundcloud.png',
//     square: 'square.png',
//     streeteasy: 'streeteasy.png',
//     venmo: 'venmo.png',
//     wechat: 'wechat.png',
//     yelp: 'yelp.png',
//   },
//   'socials-outline-color': {
//     'amazon-music': 'amazon-music.png',
//     behance: 'behance.png',
//     box: 'box.png',
//     calendly: 'calendly.png',
//     etsy: 'etsy.png',
//     imo: 'imo.png',
//     itunes: 'itunes.png',
//     notion: 'notion.png',
//     paypal: 'paypal.png',
//     skype: 'skype.png',
//     soundcloud: 'soundcloud.png',
//     square: 'square.png',
//     streeteasy: 'streeteasy.png',
//     venmo: 'venmo.png',
//     wechat: 'wechat.png',
//     yelp: 'yelp.png',
//   },
//   'socials-outline-gray': {
//     tumblr: 'tumblr.png',
//   },
//   'socials-outline-white': {
//     tumblr: 'tumblr.png',
//   },
//   'socials-white': {
//     'amazon-music': 'amazon-music.png',
//     behance: 'behance.png',
//     box: 'box.png',
//     calendly: 'calendly.png',
//     etsy: 'etsy.png',
//     imo: 'imo.png',
//     itunes: 'itunes.png',
//     notion: 'notion.png',
//     paypal: 'paypal.png',
//     skype: 'skype.png',
//     soundcloud: 'soundcloud.png',
//     square: 'square.png',
//     streeteasy: 'streeteasy.png',
//     venmo: 'venmo.png',
//     wechat: 'wechat.png',
//     yelp: 'yelp.png',
//   },
//   'socials-dark-round': {
//     'amazon-music': 'amazon-music.png',
//     behance: 'behance.png',
//     box: 'box.png',
//     calendly: 'calendly.png',
//     etsy: 'etsy.png',
//     imo: 'imo.png',
//     itunes: 'itunes.png',
//     notion: 'notion.png',
//     paypal: 'paypal.png',
//     skype: 'skype.png',
//     soundcloud: 'soundcloud.png',
//     square: 'square.png',
//     streeteasy: 'streeteasy.png',
//     venmo: 'venmo.png',
//     wechat: 'wechat.png',
//     yelp: 'yelp.png',
//   },
// } as const

// // Combine common and specific icons for each folder
// export const SOCIAL_ICONS: Record<SocialIconFolders, Partial<Record<SocialIconName, string>>> = Object.fromEntries(
//   Object.entries(FOLDER_SPECIFIC_ICONS).map(([folder, specificIcons]) => [
//     folder,
//     { ...COMMON_SOCIAL_ICONS, ...specificIcons },
//   ])
// ) as Record<SocialIconFolders, Partial<Record<SocialIconName, string>>>
