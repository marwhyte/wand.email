import { getBlockAttributes, getEmailAttributes } from '@/lib/utils/attributes/attributes'
import { getListProps } from '@/lib/utils/attributes/props'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Column, Row, Section } from '@react-email/components'
import parse from 'html-react-parser'
import { Email, ListBlock, RowBlock } from '../types'

type Props = {
  block: ListBlock
  parentRow: RowBlock
  email: Email | null
}
const EmailList = ({ block, parentRow, email }: Props) => {
  const listAttributes = getBlockAttributes(block, parentRow, email)
  const emailAttributes = getEmailAttributes(email)

  const { style, ...restListProps } = getListProps(block, parentRow, email)

  const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...restStyles } = style || {}

  const divStyle = {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  }

  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${emailAttributes.linkColor ?? '#0066CC'};`
        return domNode
      }
    },
  }

  return (
    <div style={divStyle} {...restListProps}>
      <div style={{}}>
        {listAttributes.listStyle === 'bullet' ? (
          <ul
            style={{
              marginTop: 0,
              marginBottom: 0,
              listStyleType: 'disc',
              ...restStyles,
            }}
          >
            {listAttributes.items?.map((item, index) => (
              <li key={index} style={{ marginTop: '5px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px' }}>
                {parse(item, options)}
              </li>
            ))}
          </ul>
        ) : listAttributes.listStyle === 'number' ? (
          <ol
            style={{
              marginTop: 0,
              marginBottom: 0,
              listStyleType: 'decimal',
              ...restStyles,
            }}
            start={1}
          >
            {listAttributes.items?.map((item, index) => (
              <li key={index} style={{ marginTop: '5px', marginBottom: '5px', marginLeft: '0px', marginRight: '0px' }}>
                {parse(item, options)}
              </li>
            ))}
          </ol>
        ) : (
          <Section>
            {listAttributes.items?.map((item, index) => (
              <Row key={index}>
                <Column>
                  <img
                    height={32}
                    width={32}
                    alt={listAttributes.icons?.[index] ?? 'Fallback icon'}
                    src={getPhotoUrl(`${listAttributes.icons?.[index] ?? ''}.png`, 'icons-white')}
                  />
                </Column>
                <Column width="90%">{parse(item, options)}</Column>
              </Row>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}

export default EmailList
