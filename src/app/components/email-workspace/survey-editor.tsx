import { useEmailStore } from '@/lib/stores/emailStore'
import { generateSurveyProps } from '@/lib/utils/attributes'
import { isValidHttpUrl } from '@/lib/utils/misc'
import { Checkbox, CheckboxField, CheckboxGroup } from '../checkbox'
import { ColorInput } from '../color-input'
import { Field, FieldGroup, Label } from '../fieldset'
import { Input } from '../input'
import { RowBlock, SurveyBlock, SurveyBlockAttributes } from './types'

interface Props {
  block: SurveyBlock
  onChange: (attributes: Partial<SurveyBlockAttributes>) => void
}

const SurveyEditor = ({ block, onChange }: Props) => {
  const { email } = useEmailStore()
  const parentRow = email?.rows.find((row) =>
    row.columns.some((column) => column.blocks.some((b) => b.id === block.id))
  ) as RowBlock

  const processedAttributes = generateSurveyProps(block, parentRow)

  const handleLinkChange = (type: 'yes-no' | 'rating', key: string, value: string) => {
    const newLinks = {
      ...block.attributes.links,
      [type]: {
        ...(block.attributes.links?.[type] ?? {}),
        [key]: value,
      },
    } as SurveyBlockAttributes['links']
    onChange({
      links: newLinks,
    })
  }

  const getLink = (type: 'yes-no' | 'rating', key: string): string => {
    if (type === 'yes-no') {
      return block.attributes.links?.['yes-no']?.[key as 'yes' | 'no'] ?? '/'
    } else {
      return block.attributes.links?.['rating']?.[key as '1' | '2' | '3' | '4' | '5'] ?? '/'
    }
  }

  return (
    <FieldGroup>
      <Field labelPosition="top">
        <Label>Survey Type</Label>
        <CheckboxGroup className="mt-2">
          <CheckboxField>
            <Checkbox checked={block.attributes.kind === 'yes-no'} onChange={() => onChange({ kind: 'yes-no' })} />
            <Label>Yes/No Question</Label>
          </CheckboxField>
          <CheckboxField>
            <Checkbox checked={block.attributes.kind === 'rating'} onChange={() => onChange({ kind: 'rating' })} />
            <Label>Rating Question</Label>
          </CheckboxField>
        </CheckboxGroup>
      </Field>

      <Field labelPosition="top">
        <Label>Question</Label>
        <Input
          value={block.attributes.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="Enter your survey question"
        />
      </Field>

      {block.attributes.kind === 'yes-no' && (
        <>
          <Field labelPosition="top">
            <Label>Yes Button Link</Label>
            <Input
              type="url"
              pattern="https?://.*"
              invalid={!isValidHttpUrl(getLink('yes-no', 'yes'))}
              error={
                !isValidHttpUrl(getLink('yes-no', 'yes'))
                  ? 'Please enter a valid URL (e.g., https://example.com)'
                  : undefined
              }
              title="Please enter a valid URL (e.g., https://example.com)"
              value={getLink('yes-no', 'yes')}
              onChange={(e) => handleLinkChange('yes-no', 'yes', e.target.value)}
              placeholder="Enter link for Yes response"
            />
          </Field>
          <Field labelPosition="top">
            <Label>No Button Link</Label>
            <Input
              type="url"
              pattern="https?://.*"
              invalid={!isValidHttpUrl(getLink('yes-no', 'no'))}
              error={
                !isValidHttpUrl(getLink('yes-no', 'no'))
                  ? 'Please enter a valid URL (e.g., https://example.com)'
                  : undefined
              }
              title="Please enter a valid URL (e.g., https://example.com)"
              value={getLink('yes-no', 'no')}
              onChange={(e) => handleLinkChange('yes-no', 'no', e.target.value)}
              placeholder="Enter link for No response"
            />
          </Field>
        </>
      )}

      {block.attributes.kind === 'rating' && (
        <>
          {[1, 2, 3, 4, 5].map((num) => (
            <Field labelPosition="top" key={num}>
              <Label>{`Rating ${num} Link`}</Label>
              <Input
                type="url"
                pattern="https?://.*"
                invalid={!isValidHttpUrl(getLink('rating', num.toString()))}
                error={
                  !isValidHttpUrl(getLink('rating', num.toString()))
                    ? 'Please enter a valid URL (e.g., https://example.com)'
                    : undefined
                }
                title="Please enter a valid URL (e.g., https://example.com)"
                value={getLink('rating', num.toString())}
                onChange={(e) => handleLinkChange('rating', num.toString(), e.target.value)}
                placeholder={`Enter link for rating ${num}`}
              />
            </Field>
          ))}
        </>
      )}

      <Field>
        <Label>Color (optional)</Label>
        <div>
          <ColorInput value={processedAttributes.color} onChange={(color) => onChange({ color })} />
        </div>
      </Field>
    </FieldGroup>
  )
}

export default SurveyEditor
