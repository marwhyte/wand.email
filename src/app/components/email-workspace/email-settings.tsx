import { ColorInput } from '@/app/components/color-input'
import { Field, Label } from '@/app/components/fieldset'
import { Select } from '@/app/components/select'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { getImgFromKey } from '@/lib/utils/misc'
import { useCallback } from 'react'
import Nbsp from '../nbsp'
import Range from '../range'
import { Email } from './types'

type EmailSettingsProps = {
  email: Email
}

const EmailSettings = ({ email }: EmailSettingsProps) => {
  const { setEmail } = useEmailStore()
  const { company } = useChatStore()

  const handleChange = useCallback(
    (attributes: Partial<Email>) => {
      setEmail({ ...email, ...attributes })
    },
    [email, setEmail]
  )

  const fontFamilies = [
    { label: 'Sans-serif', value: 'sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times new roman', value: 'TimesNewRoman, "Times New Roman", Times, Beskerville, Georgia, serif' },
    { label: 'Georgia', value: 'Georgia, Times, "Times New Roman", serif' },
    { label: 'Helvetica Neue', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    { label: 'Courier New', value: "'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace" },
    { label: 'Lato', value: "'Lato', Tahoma, Verdana, Segoe, sans-serif" },
    { label: 'Open Sans', value: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
    { label: 'Merriweather', value: "'Merriweather', 'Georgia', serif" },
    {
      label: 'ヒラギノ角ゴ Pro W3',
      value:
        'ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro, Osaka, メイリオ, Meiryo, ＭＳ Ｐゴシック, MS PGothic, sans-serif',
    },
    { label: 'Inter', value: "'Inter', sans-serif" },
  ]

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <Field>
        <Label>
          Content area width:
          <Nbsp />
          <span className="font-bold text-blue-500">
            {email.width.endsWith('px') ? email.width : `${email.width}px`}
          </span>
        </Label>

        <Range
          className="w-full"
          min={480}
          max={900}
          value={parseInt(email.width)}
          onChange={(e) => handleChange({ width: e.target.value })}
        />
      </Field>
      <Field>
        <Label>Default background color</Label>
        <ColorInput value={email.bgColor} onChange={(bgColor) => handleChange({ bgColor })} />
      </Field>
      <Field>
        <Label>Default text color</Label>
        <ColorInput value={email.color} onChange={(color) => handleChange({ color })} />
      </Field>
      <Field>
        <Label>Font family</Label>
        <Select
          value={email.fontFamily?.split(',')[0].replace(/['"]/g, '')}
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
    </div>
  )
}

export default EmailSettings
