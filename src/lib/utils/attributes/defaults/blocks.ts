import type {
  ButtonBlock,
  DividerBlock,
  HeadingBlock,
  ImageBlock,
  LinkBlock,
  RowBlock,
  SurveyBlock,
  TextBlock,
} from '@/app/components/email-workspace/types'
import { Company } from '@/lib/database/types'
import type { Button, Heading, Hr, Img, Link, Section, Text } from '@react-email/components'
import { shouldUseDarkText } from '../../misc'
import { getRowTypeBlockDefaults } from './rowTypeBlocks'

export const getAdditionalTextStyles = (
  textBlock: TextBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Text>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Text>['style'] = {
    paddingTop: '8px',
    paddingRight: '0',
    paddingBottom: '8px',
    paddingLeft: '0',
    margin: 0,
    fontSize: '16px',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(textBlock, parentRow) as React.ComponentProps<typeof Text>['style']) || {}

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...textBlock.attributes,
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

  const baseDefaults = {
    paddingTop: '12px',
    paddingRight: '0',
    paddingBottom: '12px',
    paddingLeft: '0',
    fontWeight: 'bold',
    lineHeight: '100%',
    fontSize: defaultHeadingSizes[headingBlock.attributes.as as keyof typeof defaultHeadingSizes] ?? '16px',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(headingBlock, parentRow) as React.ComponentProps<typeof Heading>['style']) || {}

  const { as, ...styleAttributes } = headingBlock.attributes

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalImageStyles = (
  imageBlock: ImageBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Img>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Img>['style'] = {
    objectFit: 'contain',
    borderRadius: '16px',
    padding: 0,
    width: '100%',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(imageBlock, parentRow) as React.ComponentProps<typeof Img>['style']) || {}

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
    marginTop: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(buttonBlock, parentRow) as React.ComponentProps<typeof Button>['style']) || {}

  const { href, target, rel, ...styleAttributes } = buttonBlock.attributes

  if (company?.primary_color && !styleAttributes.backgroundColor) {
    return {
      ...baseDefaults,
      ...rowTypeDefaults,
      ...styleAttributes,
      backgroundColor: company.primary_color,
      color: shouldUseDarkText(company.primary_color) ? '#000000' : '#ffffff',
    }
  } else if (!styleAttributes.backgroundColor) {
    return {
      ...baseDefaults,
      ...rowTypeDefaults,
      ...styleAttributes,
      backgroundColor: '#000000',
      color: '#ffffff',
    }
  }

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...styleAttributes,
  }
}

export const getAdditionalLinkStyles = (
  linkBlock: LinkBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Link>['style'] => {
  const baseDefaults = {
    color: '#3b82f6',
    textDecoration: 'underline',
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(linkBlock, parentRow) as React.ComponentProps<typeof Link>['style']) || {}

  const { href, target, rel, ...styleAttributes } = linkBlock.attributes

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
    marginLeft: '12px',
    marginRight: '12px',
    marginTop: '24px',
    marginBottom: '24px',
  }

  const rowTypeDefaults =
    (getRowTypeBlockDefaults(dividerBlock, parentRow) as React.ComponentProps<typeof Hr>['style']) || {}

  return {
    ...baseDefaults,
    ...rowTypeDefaults,
    ...dividerBlock.attributes,
    borderTop: 'none',
  }
}

export const getAdditionalSurveyStyles = (
  surveyBlock: SurveyBlock,
  parentRow: RowBlock
): React.ComponentProps<typeof Section>['style'] => {
  const baseDefaults: React.ComponentProps<typeof Section>['style'] = {
    paddingTop: '12px',
    paddingRight: '12px',
    paddingBottom: '12px',
    paddingLeft: '12px',
    textAlign: 'center',
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
