import type {
  ButtonBlock,
  DividerBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  ListBlock,
  RowBlock,
  SocialsBlock,
  SurveyBlock,
  TableBlock,
  TextBlock,
} from '@/app/components/email-workspace/types'
import { Email } from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'
import type { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { ensurePx, shouldUseDarkText } from '../../misc'
import { getButtonAttributes, getEmailAttributes } from '../attributes'
import { getBlockCSSProperties } from './rowTypeBlocks'

export const getAdditionalTextStyles = (
  textBlock: TextBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<typeof Text>['style'] => {
  const emailAttributes = getEmailAttributes(email)
  const baseDefaults: React.ComponentProps<typeof Text>['style'] = {
    textAlign: 'left',
    paddingTop: '10px',
    paddingRight: '0',
    paddingBottom: '10px',
    paddingLeft: '0',
    margin: 0,
    color: emailAttributes.color,
    fontSize: '16px',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    lineHeight: '100%',
    letterSpacing: 'normal',
    fontFamily: emailAttributes.fontFamily,
  }

  const rowTypeDefaults = getBlockCSSProperties(textBlock, email, parentRow) || {}

  const { content, ...styleAttributes } = textBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalHeadingStyles = (
  headingBlock: HeadingBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<typeof Heading>['style'] => {
  const defaultHeadingSizes = {
    h1: '32px',
    h2: '28px',
    h3: '20px',
    h4: '16px',
    h5: '12px',
  }

  const emailAttributes = getEmailAttributes(email)

  const baseDefaults: React.ComponentProps<typeof Heading>['style'] = {
    textAlign: 'left',
    paddingTop: '12px',
    paddingRight: '0',
    paddingBottom: '12px',
    paddingLeft: '0',
    fontWeight: 'bold',
    lineHeight: '100%',
    letterSpacing: 'normal',
    color: emailAttributes.color,
    fontFamily: emailAttributes.fontFamily,
    fontSize: defaultHeadingSizes[headingBlock.attributes.level as keyof typeof defaultHeadingSizes] ?? '16px',
  }

  const rowTypeDefaults = getBlockCSSProperties(headingBlock, email, parentRow) || {}

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
  email: Email | null,
  company: Company | null
): React.ComponentProps<typeof Img>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Img>['style'] = {
    objectFit: 'contain',
    borderRadius: imageBlock.attributes.src != 'logo' ? '16px' : undefined,
    width: '100%',
  }

  const rowTypeDefaults = getBlockCSSProperties(imageBlock, email, parentRow, company)

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
  email: Email | null,
  company: Company | null
): React.ComponentProps<typeof Button>['style'] => {
  const baseDefaults = {
    display: 'inline-block',
    color: '#ffffff',
    fontSize: '14px',
    borderRadius: '24px',
    paddingTop: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '14px',
    marginRight: '14px',
    cursor: 'pointer',
    lineHeight: '120%',
  }

  const rowTypeDefaults = getBlockCSSProperties(buttonBlock, email, parentRow) || {}
  const buttonAttributes = getButtonAttributes(buttonBlock, parentRow, email, company)

  const {
    href,
    borderColor,
    borderWidth,
    borderStyle,
    align,
    content,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    contentPaddingBottom,
    contentPaddingLeft,
    contentPaddingRight,
    contentPaddingTop,
    ...styleAttributes
  } = buttonBlock.attributes

  // Apply directional content padding to margins if they exist
  const margins = {
    marginTop: buttonAttributes.contentPaddingTop ?? baseDefaults.marginTop,
    marginBottom: buttonAttributes.contentPaddingBottom ?? baseDefaults.marginBottom,
    marginLeft: buttonAttributes.contentPaddingLeft ?? baseDefaults.marginLeft,
    marginRight: buttonAttributes.contentPaddingRight ?? baseDefaults.marginRight,
  }

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

  const backgroundColor = styleAttributes.backgroundColor || company?.primaryColor || '#3b82f6'
  const color = styleAttributes.backgroundColor
    ? styleAttributes.color
    : company?.primaryColor
      ? shouldUseDarkText(company.primaryColor)
        ? '#000000'
        : '#ffffff'
      : '#ffffff'

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
    ...borderStyles,
    ...margins,
    backgroundColor,
    color,
  }
}

export const getAdditionalLinkStyles = (
  linkBlock: LinkBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<typeof Link>['style'] => {
  const baseDefaults = {
    paddingTop: '10px',
    paddingRight: '0',
    paddingBottom: '10px',
    paddingLeft: '0',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
    lineHeight: '100%',
  }

  const rowTypeDefaults = getBlockCSSProperties(linkBlock, email, parentRow) || {}

  const { href, align, content, ...styleAttributes } = linkBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalDividerStyles = (
  dividerBlock: DividerBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<typeof Hr>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Hr>['style'] = {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#E0E0E0',
    padding: 0,
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '24px',
    paddingBottom: '24px',
  }

  const rowTypeDefaults = getBlockCSSProperties(dividerBlock, email, parentRow) || {}

  // Extract padding values from attributes to apply to margins
  const { ...otherAttributes } = dividerBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...otherAttributes,
    borderTop: 'none',
  }
}

export const getAdditionalListStyles = (
  listBlock: ListBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<typeof Section>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Section>['style'] = {
    paddingTop: '5px',
    paddingRight: '0px',
    paddingBottom: '5px',
    paddingLeft: listBlock.attributes.type === 'icon' ? '16px' : '40px',
  }

  const rowTypeDefaults = getBlockCSSProperties(listBlock, email, parentRow) || {}

  const { items, icons, type, ...styleAttributes } = listBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalSocialsStyles = (
  socialsBlock: SocialsBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<typeof Section>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Section>['style'] = {
    paddingTop: '10px',
    paddingRight: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
  }

  const rowTypeDefaults = getBlockCSSProperties(socialsBlock, email, parentRow) || {}

  const { align, folder, links, ...styleAttributes } = socialsBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalSurveyStyles = (
  surveyBlock: SurveyBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<typeof Section>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Section>['style'] = {
    paddingTop: '10px',
    paddingBottom: '10px',
  }

  const rowTypeDefaults = getBlockCSSProperties(surveyBlock, email, parentRow) || {}

  // Create a copy of attributes without 'kind', 'question', and 'links' properties
  const { kind, question, links, color, ...styleAttributes } = surveyBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalTableStyles = (
  tableBlock: TableBlock,
  parentRow: RowBlock,
  email: Email | null
): React.ComponentProps<'table'>['style'] => {
  const baseDefaults: React.ComponentProps<'table'>['style'] = {
    // @ts-expect-error
    msoTableLspace: '0pt',
    msoTableRspace: '0pt',
    borderCollapse: 'collapse',
    width: '100%',
    tableLayout: 'fixed',
    direction: 'ltr',
    backgroundColor: 'transparent',
  }

  const rowTypeDefaults = getBlockCSSProperties(tableBlock, email, parentRow) || {}

  const { rows, ...styleAttributes } = tableBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}
