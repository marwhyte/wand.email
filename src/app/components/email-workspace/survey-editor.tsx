import { Checkbox, CheckboxField, CheckboxGroup } from '../checkbox'
import { ColorInput } from '../color-input'
import { Field, Label } from '../fieldset'
import { Input } from '../input'
import { SurveyBlock, SurveyBlockAttributes } from './types'

interface Props {
  block: SurveyBlock
  onChange: (survey: SurveyBlockAttributes) => void
}

const SurveyEditor = ({ block, onChange }: Props) => {
  const survey = block.attributes

  const handleChange = (field: keyof SurveyBlockAttributes, value: any) => {
    onChange({
      ...survey,
      [field]: value,
    })
  }

  const handleLinkChange = (type: 'yes-no' | 'rating', key: string, value: string) => {
    const newLinks = {
      ...survey.links,
      [type]: {
        ...(survey.links?.[type] ?? {}),
        [key]: value,
      },
    }
    handleChange('links', newLinks)
  }

  const getLink = (type: 'yes-no' | 'rating', key: string): string => {
    if (type === 'yes-no') {
      return survey.links?.['yes-no']?.[key as 'yes' | 'no'] ?? '/'
    } else {
      return survey.links?.['rating']?.[key as '1' | '2' | '3' | '4' | '5'] ?? '/'
    }
  }

  return (
    <div className="space-y-4">
      <Field>
        <Label>Survey Type</Label>
        <CheckboxGroup className="mt-2">
          <CheckboxField>
            <Checkbox checked={survey.kind === 'yes-no'} onChange={() => handleChange('kind', 'yes-no')} />
            <Label>Yes/No Question</Label>
          </CheckboxField>
          <CheckboxField>
            <Checkbox checked={survey.kind === 'rating'} onChange={() => handleChange('kind', 'rating')} />
            <Label>Rating Question</Label>
          </CheckboxField>
        </CheckboxGroup>
      </Field>

      <Field>
        <Label>Question</Label>
        <Input value={survey.question} onChange={(e) => handleChange('question', e.target.value)} placeholder="Enter your survey question" />
      </Field>

      {survey.kind === 'yes-no' && (
        <>
          <Field>
            <Label>"Yes" Button Link</Label>
            <Input type="url" pattern="https?://.*" title="Please enter a valid URL (e.g., https://example.com)" value={getLink('yes-no', 'yes')} onChange={(e) => handleLinkChange('yes-no', 'yes', e.target.value)} placeholder="Enter link for Yes response" />
          </Field>
          <Field>
            <Label>"No" Button Link</Label>
            <Input type="url" pattern="https?://.*" title="Please enter a valid URL (e.g., https://example.com)" value={getLink('yes-no', 'no')} onChange={(e) => handleLinkChange('yes-no', 'no', e.target.value)} placeholder="Enter link for No response" />
          </Field>
        </>
      )}

      {survey.kind === 'rating' && (
        <>
          {[1, 2, 3, 4, 5].map((num) => (
            <Field key={num}>
              <Label>{`Rating ${num} Link`}</Label>
              <Input type="url" pattern="https?://.*" title="Please enter a valid URL (e.g., https://example.com)" value={getLink('rating', num.toString())} onChange={(e) => handleLinkChange('rating', num.toString(), e.target.value)} placeholder={`Enter link for rating ${num}`} />
            </Field>
          ))}
        </>
      )}

      <Field>
        <Label>Color (optional)</Label>
        <ColorInput value={survey.color} onChange={(color) => handleChange('color', color)} />
      </Field>
    </div>
  )
}

export default SurveyEditor
