type Email = {
  id: string
  name: string
  preview: string
  fontFamily: string
  bgColor: string
  bgImage?: string
  bgPosition?: string
  bgRepeat?: string
  bgSize?: string
  color: string
  width: string
  rows: RowBlock[]
}

type Project = {
  id: string
  deleted_at: Date | null
  title: string
  user_id: string
  content: Email
  created_at: Date
}

type TemplateTypes = 'personalized' | 'recommended' | 'ecommerce' | 'transactional' | 'welcome-series' | 'newsletter'

interface TemplateConfig {
  logoUrl: string | null
  colors: {
    primary: string | null
    secondary: string | null
  }
  companyName: string | null
}

type RequiredTemplateConfig = {
  [K in keyof TemplateConfig]: TemplateConfig[K] extends { [key: string]: string | null }
    ? { [P in keyof TemplateConfig[K]]: NonNullable<TemplateConfig[K][P]> }
    : NonNullable<TemplateConfig[K]>
}

type Template = {
  name: string
  id: string
  description: string
  template: Email
  types: TemplateTypes[]
}

type EmailBlockType = EmailBlock['type']

type RowBlock = {
  id: string
  type: 'row'
  attributes: RowBlockAttributes
  container: {
    align?: 'left' | 'center' | 'right'
    attributes: ContainerBlockAttributes
  }
  columns: ColumnBlock[]
}

type EmailBlock = TextBlock | ImageBlock | ButtonBlock | LinkBlock | HeadingBlock | DividerBlock | SocialsBlock

type ColumnBlock = {
  id: string
  type: 'column'
  gridColumns: number
  attributes: ColumnBlockAttributes
  blocks: EmailBlock[]
}

type HeadingBlock = {
  id: string
  type: 'heading'
  content: string
  attributes: HeadingBlockAttributes
}

type DividerBlock = {
  id: string
  type: 'divider'
  attributes: DividerBlockAttributes
}

type SocialsBlock = {
  id: string
  type: 'socials'
  attributes: SocialsBlockAttributes
}

type TextBlock = {
  id: string
  type: 'text'
  content: string
  attributes: TextBlockAttributes
}

type ImageBlock = {
  id: string
  type: 'image'
  content: string
  attributes: ImageBlockAttributes
}

type ButtonBlock = {
  id: string
  type: 'button'
  content: string
  attributes: ButtonBlockAttributes
}

type LinkBlock = {
  id: string
  type: 'link'
  content: string
  attributes: LinkBlockAttributes
}

type CommonAttributes = {
  noSidePaddingOnMobile?: boolean
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  padding?: string
  display?: string
  width?: string
  maxWidth?: string
  height?: string
  background?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  borderRadius?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  fontSize?: string
  lineHeight?: string
  color?: string
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder'
  textDecoration?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  fontStyle?: 'normal' | 'italic' | 'oblique'
}

type ContainerBlockAttributes = CommonAttributes & {
  align?: 'left' | 'center' | 'right'
  minWidth?: string
}

type RowBlockAttributes = CommonAttributes & {
  align?: 'left' | 'center' | 'right'
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
  borderWidth?: string
  borderColor?: string
  minWidth?: string
  stackOnMobile?: boolean
  reverseStackOnMobile?: boolean
  hideOnMobile?: boolean
}

type ColumnBlockAttributes = {
  align?: 'left' | 'center' | 'right'
  valign?: 'top' | 'middle' | 'bottom'
  borderSpacing?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
  borderWidth?: string
  borderColor?: string
}

type DividerBlockAttributes = CommonAttributes & {
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderWidth?: string
  borderColor?: string
}

type SocialIconFolders =
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

type SocialsBlockAttributes = CommonAttributes & {
  folder: SocialIconFolders
  socialLinks: {
    icon: SocialIconName
    url: string
    title: string
    alt: string
  }[]
}

type TextBlockAttributes = CommonAttributes & {
  fontFamily?: string
  letterSpacing?: string
  textIndent?: string
}

type HeadingBlockAttributes = CommonAttributes & {
  fontFamily?: string
  letterSpacing?: string
  textIndent?: string
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

type ImageBlockAttributes = CommonAttributes & {
  src: string
  borderRadius?: string
  alt?: string
}

type ButtonBlockAttributes = CommonAttributes & {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
  backgroundColor: string
  color: string
  paddingTop: string
  paddingBottom: string
  paddingLeft: string
  paddingRight: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
  borderWidth?: string
  borderColor?: string
}

type LinkBlockAttributes = CommonAttributes & {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

type SocialIconName =
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
const COMMON_SOCIAL_ICONS = {
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
const FOLDER_SPECIFIC_ICONS = {
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
const SOCIAL_ICONS: Record<SocialIconFolders, Partial<Record<SocialIconName, string>>> = Object.fromEntries(
  Object.entries(FOLDER_SPECIFIC_ICONS).map(([folder, specificIcons]) => [
    folder,
    { ...COMMON_SOCIAL_ICONS, ...specificIcons },
  ])
) as Record<SocialIconFolders, Partial<Record<SocialIconName, string>>>
