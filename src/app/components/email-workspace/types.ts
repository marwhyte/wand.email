import { BorderRadius } from '@/lib/database/types'

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

export type EmailTheme = string
export const emailThemes = ['#8e6ff7', '#fcf8f2', '#059669', '#3b82f6', '#fed776']

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
  | 'feature-list'
  | 'cards'
  | 'article'
  | 'gallery'
  | 'discount'
  | 'cta'
  | 'invoice'
  | 'cart'
  | 'default'

export const componentLibrary: Record<RowBlockType, { note?: string; examples: string[]; allowedBlocks: string[] }> = {
  default: {
    note: 'Use the default row type to define a row with no specific type.',
    examples: [
      `
      <ROW type="default">
        <COLUMN>
          <IMAGE src="logo" alt="Logo" />
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['IMAGE'],
  },
  cart: {
    examples: [
      `
      <ROW type="cart">
        <COLUMN>
          <CART_ITEM image="imagegen:product image" name="Product Name" description="Product description here" quantity="1" price="$19.99" />
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['CART_ITEM'],
  },
  header: {
    examples: [
      `
      <ROW type="header">
        <COLUMN>
          <IMAGE src="logo" alt="Logo" />
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  footer: {
    note: 'The footer must include an address for all commercial emails.',
    examples: [
      `
      <ROW type="footer">
        <COLUMN>
          <IMAGE src="logo" alt="Logo" />
          <SOCIALS folder="socials-color">
            <SOCIAL icon="facebook" url="#" title="Facebook" alt="Facebook" />
            <SOCIAL icon="x" url="#" title="X" alt="X" />
            <SOCIAL icon="instagram" url="#" title="Instagram" alt="Instagram" />
          </SOCIALS>
          <TEXT>123 Main Street Anytown, CA 12345<br>United States</TEXT>
          <TEXT>© 2024 Company Name. All rights reserved.</TEXT>
          <TEXT><a href="/">Unsubscribe</a> | <a href="/">Privacy Policy</a></TEXT>
          <TEXT>This email was sent to you because you signed up for updates from Company Name.</TEXT>
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['SOCIALS', 'TEXT', 'LINK', 'IMAGE'],
  },
  gallery: {
    examples: [
      `
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
    ],
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'LINK'],
  },
  discount: {
    examples: [
      `
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
    ],
    allowedBlocks: ['TEXT', 'BUTTON', 'HEADING'],
  },
  hero: {
    examples: [
      `
      <ROW type="hero">
        <COLUMN>
          <IMAGE src="imagegen:A description of the image" alt="Image description" />
          <HEADING level="h1">Welcome to Our Service</HEADING>
          <TEXT>Discover amazing features that will transform your experience.</TEXT>
          <BUTTON href="/">Get Started</BUTTON>
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'BUTTON'],
  },
  'feature-list': {
    note: 'Use ICON components to create a visually appealing feature list with icons, titles, and descriptions. Icons can be positioned above (position="top") or to the left (position="left") of the text. If there are more than 3 features, position the icons to the left.',
    examples: [
      `
      <ROW type="feature-list">
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
      `
      <ROW type="feature-list">
        <HEADING level="h2">Key Features</HEADING>
        <COLUMN>
          <ICON icon="bolt" title="Lightning Fast" description="Experience blazing fast performance" position="top" />
          <ICON icon="shield" title="Secure" description="Your data is always protected" position="left" />
          <ICON icon="star" title="Premium" description="Get access to exclusive features" />
          <ICON icon="check" title="Easy to Use" description="Simple interface for quick setup" />
          <ICON icon="settings" title="Customizable" description="Tailor your experience to your needs" />
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['HEADING', 'TEXT', 'LIST', 'IMAGE', 'ICON'],
  },
  cards: {
    examples: [
      `
      <ROW type="cards">
        <HEADING level="h2">Card Title</HEADING>
        <COLUMN>
          <IMAGE src="imagegen:product 1" alt="Product 1" />
          <HEADING level="h3">Product 1</HEADING>
          <TEXT>This is the description for product 1.</TEXT>
          <BUTTON href="/">Shop Now</BUTTON>
        </COLUMN>
        <COLUMN>
          <IMAGE src="imagegen:product 2" alt="Product 2" />
          <HEADING level="h3">Product 2</HEADING>
          <TEXT>This is the description for product 2.</TEXT>
          <BUTTON href="/">Shop Now</BUTTON>
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'BUTTON', 'LINK'],
  },
  article: {
    note: 'Use a DIVIDER component to separate a single article from the rest of the email.',
    examples: [
      `
      <ROW type="article">
        <COLUMN>
          <HEADING level="h2">Article Title</HEADING>
          <TEXT>This is the content of the article. It can contain multiple paragraphs and describe various topics in detail.</TEXT>
          <BUTTON href="/">Read More</BUTTON>
          <DIVIDER />
        </COLUMN>
      </ROW>
      `,
      `
      <ROW type="article">
        <HEADING level="h2">Latest Articles</HEADING>
        <COLUMN>
          <IMAGE src="imagegen:article 1 topic" alt="Article 1" />
          <HEADING level="h3">Article 1 Title</HEADING>
          <TEXT>A brief summary of the first article content. This introduces the reader to the topic.</TEXT>
          <LINK href="/">Read more</LINK>
        </COLUMN>
        <COLUMN>
          <IMAGE src="imagegen:article 2 topic" alt="Article 2" />
          <HEADING level="h3">Article 2 Title</HEADING>
          <TEXT>A brief summary of the second article content. This gives readers a preview of what to expect.</TEXT>
          <LINK href="/">Read more</LINK>
        </COLUMN>
      </ROW>
      `,
    ],
    allowedBlocks: ['IMAGE', 'HEADING', 'TEXT', 'BUTTON', 'LINK'],
  },
  cta: {
    examples: [
      `
      <ROW type="cta">
        <COLUMN>
          <HEADING level="h2">Ready to Get Started?</HEADING>
          <TEXT>Join thousands of satisfied customers who have already chosen our service.</TEXT>
          <BUTTON href="/">Sign Up Now</BUTTON>
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['HEADING', 'TEXT', 'BUTTON'],
  },
  invoice: {
    examples: [
      `
      <ROW type="invoice">
        <COLUMN>
          <TABLE>
            <TR>
              <TD>Item</TD>
              <TD>Quantity</TD>
              <TD>Price</TD>
            </TR>
            <TR>
              <TD>Product 1</TD>
              <TD>1</TD>
              <TD>$19.99</TD>
            </TR>
            <TR>
              <TD>Product 2</TD>
              <TD>2</TD>
              <TD>$29.99</TD>
            </TR>
            <TR>
              <TD>Total</TD>
              <TD></TD>
              <TD>$79.97</TD>
            </TR>
          </TABLE>
        </COLUMN>
      </ROW>
    `,
    ],
    allowedBlocks: ['TABLE', 'HEADING', 'TEXT'],
  },
} as const

export const blockLibrary = {
  EMAIL: {
    note: 'The theme of the email will determine the color scheme of the email. Only change the theme when asked to do so.',
    attributes: {
      styleVariant: ['default', 'outline', 'clear'],
      type: emailTypes,
      themeColor: ['#8e6ff7'],
      borderRadius: ['4'],
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
    note: 'Use any icon from the Material Symbols icon library. The icon component includes a title and description. The position attribute controls if the icon appears above the text (top) or to the left of the text (left).',
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
  themeColor?: string
  borderRadius?: BorderRadius
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
  backgroundColor?: string
  borderRadius?: string
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
