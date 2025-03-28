import { safeParseInt } from '@/lib/utils/misc'
import { ColorInput } from '../../../color-input'
import { NumberInput } from '../../../input'
import { Select } from '../../../select'
import { TextControlsProps } from './types'

export const TextControls = ({ fontSize, fontWeight, color, onChange }: TextControlsProps) => {
  return (
    <>
      <NumberInput
        className="ml-auto"
        min={1}
        max={144}
        value={safeParseInt(String(fontSize).replace('px', '')) || 16}
        onChange={(value) => {
          onChange({ fontSize: `${value}px` })
        }}
      />
      <div className="ml-auto w-24">
        <Select
          value={fontWeight || 'normal'}
          onChange={(e) => {
            onChange({ fontWeight: e.target.value as 'normal' | 'bold' })
          }}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </Select>
      </div>
      <ColorInput
        showTransparent={false}
        value={color || '#000000'}
        onChange={(value) => {
          onChange({ color: value })
        }}
      />
    </>
  )
}
