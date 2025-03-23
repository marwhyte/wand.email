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

  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'a' && (!domNode.attribs.style || !domNode.attribs.style.includes('color'))) {
        domNode.attribs.style = `color: ${emailAttributes.linkColor ?? '#0066CC'};`
        return domNode
      }
    },
  }

  return (
    <div {...restListProps}>
      {listAttributes.type === 'ul' ? (
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
      ) : listAttributes.type === 'ol' ? (
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
        <Section style={{ paddingLeft: '0px' }}>
          {listAttributes.items?.map((item, index, arr) => (
            <div key={index}>
              <Row>
                <Column style={{ width: '24px', verticalAlign: 'top', paddingBottom: '10px' }}>
                  <img
                    height={24}
                    width={24}
                    alt={`Icon for item ${index + 1}`}
                    src={getPhotoUrl(`${listAttributes.icons?.[index] ?? 'check'}.png`, 'icons-white')}
                    style={{ display: 'block' }}
                  />
                </Column>
                <Column style={{ width: '8px', paddingBottom: '10px' }}></Column>
                <Column style={{ paddingBottom: '10px' }}>{parse(item, options)}</Column>
              </Row>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

export default EmailList
