import { ColorInput } from '@/app/components/color-input'
import { Field, Label } from '@/app/components/fieldset'
import { Select } from '@/app/components/select'
import { useCallback } from 'react'
import Range from '../range'
import { useEmail } from './email-provider'

const EmailSettings = () => {
  const { email, setEmail } = useEmail()

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
          Content area width:{' '}
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
        <Select value={email.fontFamily} onChange={(e) => handleChange({ fontFamily: e.target.value })}>
          {fontFamilies.map((fontFamily) => (
            <option key={fontFamily.value} value={fontFamily.value}>
              {fontFamily.label}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  )
}

export default EmailSettings
