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

export type EmailTheme = 'default' | 'dark' | 'creme' | 'wood' | 'pink' | 'blue' | 'green'
export const emailThemes = ['default', 'dark', 'creme', 'wood', 'pink', 'blue', 'green'] as const

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

export type RowBlockType =
  | 'header'
  | 'footer'
  | 'hero'
  | 'key-features'
  | 'cards'
  | 'article'
  | 'gallery'
  | 'list'
  | 'discount'
  | 'cta'
  | 'invoice'
  | 'cart'
  | 'default'

export const componentLibrary: Record<RowBlockType, { note?: string; example: string; allowedBlocks: string[] }> = {
  default: {
    note: 'Use the default row type to define a row with no specific type.',
    example: `
      <ROW type="default">
        <COLUMN>
          <IMAGE src="logo" alt="Logo" />
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['IMAGE'],
  },
  cart: {
    example: `
      <ROW type="cart">
        <COLUMN>
          <CART_ITEM image="imagegen:product image" name="Product Name" description="Product description here" quantity="1" price="$19.99" />
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['CART_ITEM'],
  },
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
          <IMAGE src="imagegen:bed in a room" alt="Bed in room" />
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
  discount: {
    example: `
  <ROW type="discount">
    <COLUMN>
      <TEXT>
        Here is your exclusive
      </TEXT>
      <TEXT>
        <strong>10% off your first purchase</strong>
      </TEXT>
      <TEXT>
        (This code can only be used for the account associated with this email address)
      </TEXT>
      <TEXT>
        XA7I9CfqJGG
      </TEXT>
    </COLUMN>
  </ROW>
    `,
    allowedBlocks: ['TEXT', 'BUTTON', 'HEADING'],
  },
  hero: {
    example: `
      <ROW type="hero">
        <COLUMN>
          <HEADING level="h1">Welcome to Our Service</HEADING>
          <TEXT>Discover amazing features that will transform your experience.</TEXT>
          <BUTTON href="/">Get Started</BUTTON>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'BUTTON'],
  },
  'key-features': {
    note: 'Use ICON components to create a visually appealing feature list with icons, titles, and descriptions. Icons can be positioned above (position="top") or to the left (position="left") of the text.',
    example: `
      <ROW type="key-features">
        <HEADING level="h2">Key Features</HEADING>
        <COLUMN>
          <ICON icon="bolt" title="Lightning Fast" description="Experience blazing fast performance" position="top" />
        </COLUMN>
        <COLUMN>
          <ICON icon="shield" title="Secure" description="Your data is always protected" position="left" />
        </COLUMN>
        <COLUMN>
          <ICON icon="star" title="Premium" description="Get access to exclusive features" />
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['HEADING', 'TEXT', 'LIST', 'IMAGE', 'ICON'],
  },
  cards: {
    example: `
      <ROW type="cards">
        <HEADING level="h2">Card Title</HEADING>
        <TEXT>Card description goes here.</TEXT>
        <COLUMN>
          <IMAGE src="imagegen:card image" alt="Card image" />
          <HEADING level="h3">Card Title</HEADING>
          <TEXT>Card description goes here.</TEXT>
        </COLUMN>
        <COLUMN>
          <IMAGE src="imagegen:card image" alt="Card image" />
          <HEADING level="h3">Card Title</HEADING>
          <TEXT>Card description goes here.</TEXT>
        </COLUMN>
        <COLUMN>
          <IMAGE src="imagegen:card image" alt="Card image" />
          <HEADING level="h3">Card Title</HEADING>
          <TEXT>Card description goes here.</TEXT>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'BUTTON'],
  },
  article: {
    example: `
      <ROW type="article">
        <COLUMN>
          <HEADING level="h2">Article Title</HEADING>
          <TEXT>Article content goes here with paragraphs of text.</TEXT>
          <TEXT>More content in another paragraph.</TEXT>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'LINK'],
  },
  list: {
    example: `
      <ROW type="list">
        <COLUMN>
          <HEADING level="h2">List Title</HEADING>
          <LIST type="ul">
            <LI>List item 1</LI>
            <LI>List item 2</LI>
            <LI>List item 3</LI>
          </LIST>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['HEADING', 'TEXT', 'LIST'],
  },
  cta: {
    example: `
      <ROW type="cta">
        <COLUMN>
          <HEADING level="h2">Ready to get started?</HEADING>
          <TEXT>Join thousands of satisfied customers today.</TEXT>
          <BUTTON href="/">Sign Up Now</BUTTON>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['HEADING', 'TEXT', 'BUTTON', 'IMAGE'],
  },
  invoice: {
    example: `
      <ROW type="invoice">
        <COLUMN>
          <HEADING level="h2">Invoice #12345</HEADING>
          <TEXT>Date: January 1, 2024</TEXT>
          <TEXT>Amount: $99.99</TEXT>
          <BUTTON href="/">View Invoice</BUTTON>
        </COLUMN>
      </ROW>
    `,
    allowedBlocks: ['HEADING', 'TEXT', 'BUTTON', 'TABLE'],
  },
} as const

export const blockLibrary = {
  EMAIL: {
    note: 'The theme of the email will determine the color scheme of the email. Only change the theme when asked to do so.',
    attributes: {
      styleVariant: ['default', 'outline', 'clear'],
      type: emailTypes,
      preview: ['This is a preview text'],
      width: ['600'],
      backgroundColor: ['#ffffff'],
      color: ['#000000'],
      fontFamily: [
        'Arial, Helvetica, sans-serif',
        'Helvetica, Arial, sans-serif',
        '"Times New Roman", Times, serif',
        'Georgia, "Times New Roman", Times, serif',
        'Verdana, Arial, sans-serif',
        'Tahoma, Verdana, sans-serif',
        'Trebuchet MS, Trebuchet, Arial, sans-serif',
        'Open Sans, Helvetica, Arial, sans-serif',
      ],
      linkColor: ['#0000FF'],
      rowBackgroundColor: ['#ffffff'],
      theme: emailThemes,
    },
  },
  ROW: {
    attributes: {
      borderRadius: ['4'],
      borderRadiusSide: ['top', 'bottom', 'all'],
      borderWidth: ['1'],
      borderColor: ['#000000'],
      borderStyle: ['solid', 'dashed', 'dotted'],
      borderSide: ['leftRight', 'topBottom', 'all'],
    },
  },
  COLUMN: {
    attributes: {
      width: ['25%'],
    },
  },
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
  ICON: {
    note: "Use any icon from Google's material symbols. The icon component includes a title and description. The position attribute controls if the icon appears above the text (top) or to the left of the text (left).",
    example: `
      <ICON icon="bolt" title="Fast Performance" description="Lightning-fast loading speeds for your website" position="top" />
    `,
    attributes: {
      align: ['left', 'center', 'right'],
      icon: ['bolt', 'check', 'star', 'home', 'key', 'shopping_cart', 'settings'],
      color: ['#000000'],
      size: ['24', '32', '48'],
      padding: ['10,0,10,0'],
      position: ['top', 'left'],
    },
  },
  IMAGE: {
    note: 'Use imagegen:description to generate an image with a detailed description. Use logo to use the company logo. Use https://images.pexels.com/photos/example.png to use a placeholder image.',
    attributes: {
      align: ['left', 'center', 'right'],
      alt: ['Image description'],
      borderRadius: ['8'],
      src: ['logo', 'imagegen:description', 'https://images.pexels.com/photos/example.png'],
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
    example: `
      <LIST type="ul">
        <LI>Item 1</LI>
        <LI>Item 2</LI>
        <LI>Item 3</LI>
      </LIST>
    `,
    note: 'Use LI elements to define list items.',
    attributes: {
      padding: ['10,0,10,0'],
      type: ['ul', 'ol'],
    },
  },
  SOCIALS: {
    example: `
      <SOCIALS>
        <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
        <SOCIAL icon="x" url="#" title="X" alt="X" />
        <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
      </SOCIALS>
    `,
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
  SPACER: {
    attributes: {
      height: ['10', '20', '30', '40', '50'],
    },
  },
}

// Type for component types
export type ComponentType = keyof typeof componentLibrary

// Type for allowed blocks based on component type
export type AllowedBlocks<T extends ComponentType> = (typeof componentLibrary)[T]['allowedBlocks'][number]

export type EmailStyleVariant = 'default' | 'outline' | 'clear'
export const emailStyleVariants = ['default', 'outline', 'clear'] as const

export type ThemeColors = {
  name: string
  light: string
  base: string
  action: string
  gradientLight: {
    start: string
    end: string
  }
  gradientDark: {
    start: string
    end: string
  }
}

export const themeColorMap: Record<EmailTheme, ThemeColors> = {
  default: {
    name: 'purple',
    light: '#f8f9fa',
    base: '#ffffff',
    action: '#8e6ff7',
    gradientLight: {
      start: '#faf5ff',
      end: '#e0e7ff',
    },
    gradientDark: {
      start: '#e0e7ff',
      end: '#e9d5ff',
    },
  },
  dark: {
    name: 'dark',
    light: '#2c3032',
    base: '#1a1c1e',
    action: '#90caf9',
    gradientLight: {
      start: '#90caf9',
      end: '#6633ff',
    },
    gradientDark: {
      start: '#e0e7ff',
      end: '#e9d5ff',
    },
  },
  creme: {
    name: 'creme',
    light: '#f8f5ee',
    base: '#fcf9f2',
    action: '#d4a373',
    gradientLight: {
      start: '#d4a373',
      end: '#b38248',
    },
    gradientDark: {
      start: '#f8f5ee',
      end: '#fcf9f2',
    },
  },
  wood: {
    name: 'wood',
    light: '#e4d5c3',
    base: '#d9c5ad',
    action: '#774936',
    gradientLight: {
      start: '#774936',
      end: '#553322',
    },
    gradientDark: {
      start: '#e4d5c3',
      end: '#f8f5ee',
    },
  },
  pink: {
    name: 'pink',
    light: '#fce9f1',
    base: '#ffd6e9',
    action: '#ff69b4',
    gradientLight: {
      start: '#ff69b4',
      end: '#ff3385',
    },
    gradientDark: {
      start: '#fce9f1',
      end: '#f8f5ee',
    },
  },
  blue: {
    name: 'blue',
    light: '#e6f2ff',
    base: '#dbeafe',
    action: '#3b82f6',
    gradientLight: {
      start: '#3b82f6',
      end: '#2563eb',
    },
    gradientDark: {
      start: '#e6f2ff',
      end: '#dbeafe',
    },
  },
  green: {
    name: 'green',
    light: '#ecfdf5',
    base: '#d1fae5',
    action: '#059669',
    gradientLight: {
      start: '#059669',
      end: '#047857',
    },
    gradientDark: {
      start: '#ecfdf5',
      end: '#d1fae5',
    },
  },
}

export type Email = {
  backgroundColor?: string
  color?: string
  fontFamily?: string
  linkColor?: string
  preview?: string
  rowBackgroundColor?: string
  rows: RowBlock[]
  width?: string
  styleVariant?: EmailStyleVariant
  theme?: EmailTheme
  borderRadius?: 'default' | 'rounded' | 'square'
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
  | IconBlock
  | ImageBlock
  | LinkBlock
  | ListBlock
  | SocialsBlock
  | SpacerBlock
  | TableBlock
  | SurveyBlock
  | TextBlock
  | SpacerBlock

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

// Add the SpacerBlock type
export type SpacerBlock = {
  id: string
  type: 'spacer'
  attributes: SpacerBlockAttributes
}

export type IconBlock = {
  id: string
  type: 'icon'
  attributes: IconBlockAttributes
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
  borderRadiusSide?: 'top' | 'bottom' | 'all'
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderWidth?: string
  borderSide?: 'leftRight' | 'topBottom' | 'all'
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
    type: 'ul' | 'ol'
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

export type SpacerBlockAttributes = {
  height: string
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

export type IconBlockAttributes = PaddingAttributes & {
  align?: 'left' | 'center' | 'right'
  icon: string
  title?: string
  description?: string
  color?: string
  size?: string
  position?: 'top' | 'left'
  s3IconUrl?: string
}
