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
      ROW type=header {
        COLUMN {
          LOGO src="logo" alt="Logo"
        }
      }
    `,
    allowedBlocks: ['SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  footer: {
    example: `
      ROW type=footer {
        COLUMN {
          LOGO src="logo" alt="Logo"
          TEXT content=<p>Company Name</p>
          SOCIALS folder=socials-color links=[{"icon": "facebook", "url": "#"}, {"icon": "x", "url": "#"}, {"icon": "instagram", "url": "#"}]
          TEXT content=<p>123 Main Street Anytown, CA 12345<br>United States</p>
          TEXT content=<p>mail@company.com</p>
          TEXT content=<p>© 2024 Company Name. All rights reserved.</p>
        }
      }
    `,
    allowedBlocks: ['SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  gallery: {
    example: `
      ROW type=gallery {
        COLUMN {
          IMAGE src="pexels:bed" alt="Bed in room"
        }
        COLUMN {
          HEADING content=<p>Deck out your dorm</p> level=h2
          TEXT content=<p>Own your space with decor, home essentials, and more.</p>
          BUTTON content=<p>Start designing</p> href="/"
        }
      }
    `,
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'LINK'],
  },
  list: {
    example: `
      ROW type=list {
        COLUMN {
          TEXT content=<p>List Item 1</p>
          TEXT content=<p>List Item 2</p>
          TEXT content=<p>List Item 3</p>
        }
      }
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
      content: ['<p>Click Here</p>'],
      fontWeight: ['normal', 'bold'],
      fontSize: ['16'],
      padding: ['10,0,10,0'],
      href: ['"#"'],
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
      content: ['<p>Heading Text</p>'],
      fontWeight: ['bold'],
      fontSize: ['18'],
      lineHeight: ['1.2'],
      padding: ['10,0,10,0'],
    },
  },
  IMAGE: {
    attributes: {
      align: ['left', 'center', 'right'],
      alt: ['"Image description"'],
      borderRadius: ['8'],
      src: ['"logo"', '"pexels:keyword"', '"https://images.pexels.com/photos/example.png"'],
      width: ['100%', '50%'],
      padding: ['10,0,10,0'],
    },
  },
  LINK: {
    attributes: {
      align: ['left', 'center', 'right'],
      href: ['"#"'],
      color: ['#0000FF'],
      content: ['<p>Click here</p>'],
      fontWeight: ['normal', 'bold'],
      fontSize: ['16'],
      padding: ['5,0,5,0'],
    },
  },
  SOCIALS: {
    attributes: {
      align: ['left', 'center', 'right'],
      folder: FOLDERS.map((folder) => folder.name),
      links: ['[{"icon": "facebook", "url": "#"}, {"icon": "x", "url": "#"}, {"icon": "instagram", "url": "#"}]'],
      padding: ['10,0,10,0'],
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
    attributes: {
      align: ['left', 'center', 'right'],
      rows: [
        '[<p>S&P 500</p>,<p>5,599</p>,<p>+0.49%</p>],[<p>Nasdaq</p>,<p>12,345</p>,<p>+0.49%</p>],[<p>Dow</p>,<p>23,456</p>,<p>+0.49%</p>]',
      ],
    },
  },
  TEXT: {
    attributes: {
      textAlign: ['left', 'center', 'right'],
      color: ['#000000'],
      content: ['<p>Your text content goes here.</p>'],
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
export type EmailType =
  | 'default'
  | 'welcome-series'
  | 'e-commerce'
  | 'invite'
  | 'transactional'
  | 'newsletter'
  | 'invoice'
  | 'cart'
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
  width?: string
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

export type ColumnBlockAttributes = {}

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
