import type {
  ButtonBlock,
  DividerBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  RowBlock,
  SocialsBlock,
  SurveyBlock,
  TextBlock,
} from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'
import type { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { ensurePx, shouldUseDarkText } from '../../misc'
import { getRowTypeBlockDefaults } from './rowTypeBlocks'

export const getAdditionalTextStyles = (
  textBlock: TextBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Text>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Text>['style'] = {
    textAlign: 'left',
    paddingTop: '10px',
    paddingRight: '0',
    paddingBottom: '10px',
    paddingLeft: '0',
    margin: 0,
    fontSize: '16px',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    lineHeight: '120%',
    letterSpacing: 'normal',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(textBlock, parentRow) as React.ComponentProps<typeof Text>['style']) || {}

  const { content, ...styleAttributes } = textBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalHeadingStyles = (
  headingBlock: HeadingBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Heading>['style'] => {
  const defaultHeadingSizes = {
    h1: '48px',
    h2: '32px',
    h3: '24px',
    h4: '16px',
    h5: '12px',
  }

  const baseDefaults: React.ComponentProps<typeof Heading>['style'] = {
    textAlign: 'left',
    paddingTop: '12px',
    paddingRight: '0',
    paddingBottom: '12px',
    paddingLeft: '0',
    fontWeight: 'bold',
    lineHeight: '120%',
    letterSpacing: 'normal',
    fontSize: defaultHeadingSizes[headingBlock.attributes.level as keyof typeof defaultHeadingSizes] ?? '16px',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(headingBlock, parentRow) as React.ComponentProps<typeof Heading>['style']) || {}

  const { level, content, ...styleAttributes } = headingBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalImageStyles = (
  imageBlock: ImageBlock,
  parentRow: RowBlock,
  company: Company | null
): React.ComponentProps<typeof Img>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Img>['style'] = {
    objectFit: 'contain',
    borderRadius: '16px',
    width: '100%',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(imageBlock, parentRow, company) as React.ComponentProps<typeof Img>['style']) || {}

  const { src, alt, ...styleAttributes } = imageBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalButtonStyles = (
  buttonBlock: ButtonBlock,
  parentRow: RowBlock,
  company: Company | null
): React.ComponentProps<typeof Button>['style'] => {
  const baseDefaults = {
    display: 'inline-block',
    color: '#ffffff',
    fontSize: '14px',
    borderRadius: '24px',
    paddingTop: '10px',
    paddingRight: '14px',
    paddingBottom: '10px',
    paddingLeft: '14px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    cursor: 'pointer',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(buttonBlock, parentRow) as React.ComponentProps<typeof Button>['style']) || {}

  const { href, borderColor, borderWidth, borderStyle, align, content, ...styleAttributes } = buttonBlock.attributes

  const borderStyles = borderWidth
    ? {
        borderLeft: `${ensurePx(borderWidth)} ${borderStyle} ${borderColor}`,
        borderRight: `${ensurePx(borderWidth)} ${borderStyle} ${borderColor}`,
        borderTop: `${ensurePx(borderWidth)} ${borderStyle} ${borderColor}`,
        borderBottom: `${ensurePx(borderWidth)} ${borderStyle} ${borderColor}`,
      }
    : {
        borderLeft: '0px solid transparent',
        borderRight: '0px solid transparent',
        borderTop: '0px solid transparent',
        borderBottom: '0px solid transparent',
      }

  const backgroundColor = styleAttributes.backgroundColor || company?.primary_color || '#000000'
  const color = styleAttributes.backgroundColor
    ? styleAttributes.color
    : company?.primary_color
      ? shouldUseDarkText(company.primary_color)
        ? '#000000'
        : '#ffffff'
      : '#ffffff'

  console.log('1', borderStyles)

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
    ...borderStyles,
    backgroundColor,
    color,
  }
}

export const getAdditionalLinkStyles = (
  linkBlock: LinkBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Link>['style'] => {
  const baseDefaults = {
    paddingTop: '10px',
    paddingRight: '0',
    paddingBottom: '10px',
    paddingLeft: '0',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(linkBlock, parentRow) as React.ComponentProps<typeof Link>['style']) || {}

  const { href, align, content, ...styleAttributes } = linkBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalDividerStyles = (
  dividerBlock: DividerBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Hr>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Hr>['style'] = {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#E0E0E0',
    padding: 0,
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '24px',
    paddingBottom: '24px',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(dividerBlock, parentRow) as React.ComponentProps<typeof Hr>['style']) || {}

  // Extract padding values from attributes to apply to margins
  const { ...otherAttributes } = dividerBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...otherAttributes,
    borderTop: 'none',
  }
}

export const getAdditionalSocialsStyles = (
  socialsBlock: SocialsBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Section>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Section>['style'] = {
    paddingTop: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(socialsBlock, parentRow) as React.ComponentProps<typeof Section>['style']) || {}

  const { align, ...styleAttributes } = socialsBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalSurveyStyles = (
  surveyBlock: SurveyBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Section>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Section>['style'] = {
    paddingTop: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(surveyBlock, parentRow) as React.ComponentProps<typeof Section>['style']) || {}

  // Create a copy of attributes without 'kind', 'question', and 'links' properties
  const { kind, question, links, ...styleAttributes } = surveyBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}
