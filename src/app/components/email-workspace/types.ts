export const componentLibrary = {
  header: {
    variants: ['simple', 'modern', 'elegant'],
    allowedBlocks: ['NAVBAR', 'SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  footer: {
    variants: ['simple', 'modern', 'elegant'],
    allowedBlocks: ['NAVBAR', 'SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  ecommerce: {
    variants: ['grid', 'featured', 'showcase'],
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'BUTTON'],
  },
  gallery: {
    variants: ['list', 'cards', 'magazine'],
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'LINK'],
  },
  features: {
    variants: ['icons', 'cards', 'columns'],
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT'],
  },
  survey: {
    variants: ['simple', 'detailed'],
    allowedBlocks: ['HEADING', 'TEXT', 'BUTTON'],
  },
} as const

// Type for component types
export type ComponentType = keyof typeof componentLibrary

// Type for variants based on component type
export type ComponentVariant<T extends ComponentType> = (typeof componentLibrary)[T]['variants'][number]

// Type for allowed blocks based on component type
export type AllowedBlocks<T extends ComponentType> = (typeof componentLibrary)[T]['allowedBlocks'][number]

export type Email = {
  bgColor: string
  color: string
  fontFamily: string
  id: string
  linkColor: string
  preview: string
  rowBgColor: string
  rows: RowBlock[]
  width: string
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
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
  borderWidth?: string
  columnSpacing?: number
  hideOnMobile?: boolean
  stackOnMobile?: boolean
  type?: ComponentType
  variant?: ComponentVariant<ComponentType>
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
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
    borderWidth?: string
    href: string
    marginBottom?: string
    marginLeft?: string
    marginRight?: string
    marginTop?: string
  }

export type DividerBlockAttributes = PaddingAttributes & {
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderWidth?: string
  borderColor?: string
}

export type HeadingBlockAttributes = TextAttributes &
  PaddingAttributes & {
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    textAlign?: 'left' | 'center' | 'right' | 'justify'
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
  socialLinks: {
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

export type TextBlockAttributes = TextAttributes &
  PaddingAttributes & {
    textAlign?: 'left' | 'center' | 'right' | 'justify'
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
export const FOLDER_SPECIFIC_ICONS = {
  'socials-blue': {
    'amazon-music': 'amazon-music.png',
    behance: 'behance.png',
    box: 'box.png',
    calendly: 'calendly.png',
    etsy: 'etsy.png',
    imo: 'imo.png',
    itunes: 'itunes.png',
    notion: 'notion.png',
    paypal: 'paypal.png',
    skype: 'skype.png',
    soundcloud: 'soundcloud.png',
    square: 'square.png',
    streeteasy: 'streeteasy.png',
    venmo: 'venmo.png',
    wechat: 'wechat.png',
    yelp: 'yelp.png',
  },
  'socials-color': {
    'amazon-music': 'amazon-music.png',
    behance: 'behance.png',
    box: 'box.png',
    calendly: 'calendly.png',
    etsy: 'etsy.png',
    imo: 'imo.png',
    itunes: 'itunes.png',
    notion: 'notion.png',
    paypal: 'paypal.png',
    skype: 'skype.png',
    soundcloud: 'soundcloud.png',
    square: 'square.png',
    streeteasy: 'streeteasy.png',
    venmo: 'venmo.png',
    wechat: 'wechat.png',
    yelp: 'yelp.png',
  },
  'socials-dark-gray': {
    'amazon-music': 'amazon-music.png',
    behance: 'behance.png',
    box: 'box.png',
    calendly: 'calendly.png',
    etsy: 'etsy.png',
    imo: 'imo.png',
    itunes: 'itunes.png',
    notion: 'notion.png',
    paypal: 'paypal.png',
    skype: 'skype.png',
    soundcloud: 'soundcloud.png',
    square: 'square.png',
    streeteasy: 'streeteasy.png',
    venmo: 'venmo.png',
    wechat: 'wechat.png',
    yelp: 'yelp.png',
  },
  'socials-dark': {
    'amazon-music': 'amazon-music.png',
    behance: 'behance.png',
    box: 'box.png',
    calendly: 'calendly.png',
    etsy: 'etsy.png',
    imo: 'imo.png',
    itunes: 'itunes.png',
    notion: 'notion.png',
    paypal: 'paypal.png',
    skype: 'skype.png',
    soundcloud: 'soundcloud.png',
    square: 'square.png',
    streeteasy: 'streeteasy.png',
    venmo: 'venmo.png',
    wechat: 'wechat.png',
    yelp: 'yelp.png',
  },
  'socials-outline-black': {
    tumblr: 'tumblr.png',
  },
  'socials-outline-color': {
    'amazon-music': 'amazon-music.png',
    behance: 'behance.png',
    box: 'box.png',
    calendly: 'calendly.png',
    etsy: 'etsy.png',
    imo: 'imo.png',
    itunes: 'itunes.png',
    notion: 'notion.png',
    paypal: 'paypal.png',
    skype: 'skype.png',
    soundcloud: 'soundcloud.png',
    square: 'square.png',
    streeteasy: 'streeteasy.png',
    venmo: 'venmo.png',
    wechat: 'wechat.png',
    yelp: 'yelp.png',
  },
  'socials-outline-gray': {
    tumblr: 'tumblr.png',
  },
  'socials-outline-white': {
    tumblr: 'tumblr.png',
  },
  'socials-white': {
    'amazon-music': 'amazon-music.png',
    behance: 'behance.png',
    box: 'box.png',
    calendly: 'calendly.png',
    etsy: 'etsy.png',
    imo: 'imo.png',
    itunes: 'itunes.png',
    notion: 'notion.png',
    paypal: 'paypal.png',
    skype: 'skype.png',
    soundcloud: 'soundcloud.png',
    square: 'square.png',
    streeteasy: 'streeteasy.png',
    venmo: 'venmo.png',
    wechat: 'wechat.png',
    yelp: 'yelp.png',
  },
  'socials-dark-round': {
    'amazon-music': 'amazon-music.png',
    behance: 'behance.png',
    box: 'box.png',
    calendly: 'calendly.png',
    etsy: 'etsy.png',
    imo: 'imo.png',
    itunes: 'itunes.png',
    notion: 'notion.png',
    paypal: 'paypal.png',
    skype: 'skype.png',
    soundcloud: 'soundcloud.png',
    square: 'square.png',
    streeteasy: 'streeteasy.png',
    venmo: 'venmo.png',
    wechat: 'wechat.png',
    yelp: 'yelp.png',
  },
} as const

// Combine common and specific icons for each folder
export const SOCIAL_ICONS: Record<SocialIconFolders, Partial<Record<SocialIconName, string>>> = Object.fromEntries(
  Object.entries(FOLDER_SPECIFIC_ICONS).map(([folder, specificIcons]) => [
    folder,
    { ...COMMON_SOCIAL_ICONS, ...specificIcons },
  ])
) as Record<SocialIconFolders, Partial<Record<SocialIconName, string>>>
