import { Field, Label } from '@/app/components/fieldset'
import { Input } from '@/app/components/input'
import { Switch, SwitchField } from '@/app/components/switch'
import { Text } from '@components/text'
import { useEffect, useState } from 'react'

export type PaddingValues = {
  top: string
  right: string
  bottom: string
  left: string
}

type PaddingFormProps = {
  padding: PaddingValues
  onChange: (values: Partial<PaddingValues>) => void
}

export default function PaddingForm({ padding, onChange }: PaddingFormProps) {
  const [localPadding, setLocalPadding] = useState(padding)
  const [isAdvanced, setIsAdvanced] = useState(() => {
    const values = Object.values(padding)
    return !values.every((value) => value === values[0])
  })

  useEffect(() => {
    setLocalPadding(padding)
  }, [padding])

  const handlePaddingChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: string) => {
    const newValue = value === '' ? '' : isNaN(parseInt(value, 10)) ? '0px' : `${parseInt(value, 10)}px`
    const newPadding = { ...localPadding, [side.toLowerCase()]: newValue }
    setLocalPadding(newPadding)
    onChange(newPadding) // Send the entire updated padding object
  }

  const handleSimplePaddingChange = (value: string) => {
    const newValue = value === '' ? '' : `${parseInt(value, 10)}px`
    const newPadding = {
      top: newValue,
      right: newValue,
      bottom: newValue,
      left: newValue,
    }
    setLocalPadding(newPadding)
    onChange(newPadding)
  }

  const handleAdvancedToggle = (newValue: boolean) => {
    if (!newValue) {
      // When switching from advanced to simple, set all sides to the first non-zero value
      const firstNonZeroValue = Object.values(localPadding).find((value) => parseInt(value, 10) !== 0) || '0px'
      const newPadding = {
        top: firstNonZeroValue,
        right: firstNonZeroValue,
        bottom: firstNonZeroValue,
        left: firstNonZeroValue,
      }
      setLocalPadding(newPadding)
      onChange(newPadding)
    }
    setIsAdvanced(newValue)
  }

  return (
    <Field>
      <div className="flex items-center justify-between">
        <Label>Padding</Label>
        <SwitchField>
          <Switch checked={isAdvanced} onChange={handleAdvancedToggle} />
          <Label>Advanced</Label>
        </SwitchField>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {isAdvanced ? (
          (['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => (
            <div key={side} className="flex items-center">
              <Input
                type="text"
                value={localPadding[side.toLowerCase() as keyof typeof localPadding].replace('px', '')}
                onChange={(e) => handlePaddingChange(side, e.target.value)}
                placeholder="In px"
              />
              <span className="ml-2 text-sm">{side}</span>
            </div>
          ))
        ) : (
          <div className="">
            <Input
              type="text"
              value={localPadding.top.replace('px', '')}
              onChange={(e) => handleSimplePaddingChange(e.target.value)}
              placeholder="In px"
            />
            <Text className="ml-2 text-sm">All sides</Text>
          </div>
        )}
      </div>
    </Field>
  )
}
