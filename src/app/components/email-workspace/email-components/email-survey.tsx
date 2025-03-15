import { generateSurveyProps } from '@/lib/utils/attributes'
import { getPhotoUrl } from '@/lib/utils/misc'
import { Button, Column, Row, Section, Text } from '@react-email/components'
import { RowBlock, SurveyBlock } from '../types'

type Props = {
  block: SurveyBlock
  parentRow: RowBlock
}

const EmailSurvey = ({ block, parentRow }: Props) => {
  const { color } = generateSurveyProps(block, parentRow)

  if (block.attributes.kind === 'yes-no') {
    return (
      <Section>
        <Text
          style={{
            margin: 0,
            paddingBottom: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: '24px',
            color: color,
            textAlign: 'center',
          }}
        >
          {block.attributes.question}
        </Text>
        <Row>
          <Column align="center">
            <table>
              <tbody>
                <tr>
                  <td align="center" style={{ padding: '4px' }}>
                    <Button href={block.attributes.links?.['yes-no']?.yes} style={{ padding: 0 }}>
                      <img src={getPhotoUrl('yes.png', 'ebay')} alt="Yes" width={24} height={24} />
                    </Button>
                  </td>
                  <td align="center" style={{ padding: '4px' }}>
                    <Button href={block.attributes.links?.['yes-no']?.no} style={{ padding: 0 }}>
                      <img src={getPhotoUrl('no.png', 'ebay')} alt="No" width={24} height={24} />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </Section>
    )
  }

  if (block.attributes.kind === 'rating') {
    return (
      <Section>
        <Text
          style={{
            fontSize: '16px',
            lineHeight: '24px',
            color: color,
            margin: 0,
            paddingBottom: '16px',
            textAlign: 'center',
          }}
        >
          {block.attributes.question}
        </Text>
        <Row>
          <Column align="center">
            <table>
              <tbody>
                <tr>
                  {[1, 2, 3, 4, 5].map((number) => (
                    <td align="center" style={{ padding: '4px' }} key={number}>
                      <Button
                        style={{
                          height: '38px',
                          width: '38px',
                          borderRadius: '8px',
                          border: `1px solid ${color}`,
                          padding: '8px',
                          fontWeight: '600',
                          color: color,
                        }}
                        href={block.attributes.links?.rating?.[number as 1 | 2 | 3 | 4 | 5] ?? '/'}
                      >
                        {number}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </Section>
    )
  }
}

export default EmailSurvey
