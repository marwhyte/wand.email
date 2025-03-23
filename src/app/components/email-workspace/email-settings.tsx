import { ColorInput } from '@/app/components/color-input'
import { Field, FieldGroup, Label } from '@/app/components/fieldset'
import { Select } from '@/app/components/select'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { getEmailAttributes } from '@/lib/utils/attributes'
import { getImgFromKey } from '@/lib/utils/misc'
import { useCallback } from 'react'
import { NumberInput } from '../input'
import Nbsp from '../nbsp'
import { Email, EmailStyleVariant } from './types'

type EmailSettingsProps = {
  email: Email
}

const EmailSettings = ({ email }: EmailSettingsProps) => {
  const { company, chatId } = useChatStore()
  const saveEmail = useEmailSave(chatId)

  const handleChange = useCallback(
    (attributes: Partial<Email>) => {
      const updatedEmail = { ...email, ...attributes }
      saveEmail(updatedEmail)
    },
    [email]
  )

  const fontFamilies = [
    { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Georgia', value: 'Georgia, "Times New Roman", Times, serif' },
    { label: 'Verdana', value: 'Verdana, Arial, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, Verdana, sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", Arial, sans-serif' },
    { label: 'Outfit', value: 'Outfit, Roboto, Helvetica, Arial, sans-serif' },
    { label: 'Open Sans', value: 'Open Sans, Roboto, Helvetica, Arial, sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, Arial, sans-serif' },
  ]

  const emailAttributes = getEmailAttributes(email)

  return (
    <FieldGroup className="p-4">
      <Field>
        <Label>
          Content area width
          <Nbsp />
        </Label>

        <NumberInput
          className="w-full"
          min={480}
          max={900}
          value={parseInt(emailAttributes.width ?? '600')}
          onChange={(e) => handleChange({ width: `${e}` })}
        />
      </Field>
      <Field>
        <Label>Background color</Label>
        <ColorInput
          value={emailAttributes.backgroundColor}
          onChange={(backgroundColor) => handleChange({ backgroundColor })}
        />
      </Field>
      <Field>
        <Label>Default text color</Label>
        <ColorInput value={emailAttributes.color} onChange={(color) => handleChange({ color })} />
      </Field>
      <Field>
        <Label>Default link color</Label>
        <ColorInput value={emailAttributes.linkColor} onChange={(linkColor) => handleChange({ linkColor })} />
      </Field>
      <Field>
        <Label>Row background color</Label>
        <ColorInput
          value={emailAttributes.rowBackgroundColor}
          onChange={(rowBackgroundColor) => handleChange({ rowBackgroundColor })}
        />
      </Field>
      <Field>
        <Label>Font family</Label>
        <Select
          value={emailAttributes.fontFamily?.split(',')[0].replace(/['"]/g, '')}
          onChange={(e) => {
            const selectedFont = fontFamilies.find((f) => f.label === e.target.value)
            handleChange({ fontFamily: selectedFont?.value || e.target.value })
          }}
        >
          {fontFamilies.map((fontFamily) => (
            <option key={fontFamily.value} value={fontFamily.label}>
              {fontFamily.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label>Variant</Label>
        <Select
          value={emailAttributes.styleVariant}
          onChange={(e) => handleChange({ styleVariant: e.target.value as EmailStyleVariant })}
        >
          <option value="default">Default</option>
          <option value="outline">Outline</option>
          <option value="floating">Floating</option>
        </Select>
      </Field>
      {company && (
        <Field>
          <Label>Company branding</Label>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              {company.logo_image_key && (
                <img
                  src={getImgFromKey(company.logo_image_key)}
                  alt={`${company.name} logo`}
                  className="h-8 min-w-8 max-w-[70px] bg-white object-contain"
                />
              )}
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{company.name}</span>
                {company.primary_color && (
                  <div
                    className="h-4 w-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: company.primary_color }}
                    title={`Primary color: ${company.primary_color}`}
                  />
                )}
              </div>
            </div>
          </div>
        </Field>
      )}
    </FieldGroup>
  )
}

export default EmailSettings
