import * as Headless from '@headlessui/react'

import { Label } from '@/app/components/fieldset'
import { NumberInput } from '@/app/components/input'
import { Switch, SwitchField } from '@/app/components/switch'
import { useEffect, useState } from 'react'

export type PaddingValues = {
  top: string
  right: string
  bottom: string
  left: string
}

type PaddingFormProps = {
  padding: PaddingValues
  label?: string
  onChange: (values: Partial<PaddingValues>) => void
}

export default function PaddingForm({ padding, label, onChange }: PaddingFormProps) {
  const [localPadding, setLocalPadding] = useState(padding)
  const [isAdvanced, setIsAdvanced] = useState(() => {
    const values = Object.values(padding)
    return !values.every((value) => value === values[0])
  })

  useEffect(() => {
    setLocalPadding(padding)
  }, [padding])

  const handlePaddingChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: number) => {
    const newValue = `${value}px`
    const newPadding = { ...localPadding, [side.toLowerCase()]: newValue }
    setLocalPadding(newPadding)
    onChange(newPadding) // Send the entire updated padding object
  }

  const handleSimplePaddingChange = (value: number) => {
    const newValue = `${value}px`
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
    <Headless.Field>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <SwitchField>
          <Switch checked={isAdvanced} onChange={handleAdvancedToggle} />
          <Label>Advanced</Label>
        </SwitchField>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {isAdvanced ? (
          (['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => (
            <div key={side} className="flex items-center">
              <NumberInput
                label={side}
                min={0}
                max={60}
                value={parseInt(localPadding[side.toLowerCase() as keyof typeof localPadding], 10) || 0}
                onChange={(value) => handlePaddingChange(side, value)}
              />
            </div>
          ))
        ) : (
          <div>
            <NumberInput
              label="All sides"
              min={0}
              max={60}
              value={parseInt(localPadding.top, 10) || 0}
              onChange={(value) => handleSimplePaddingChange(value)}
            />
          </div>
        )}
      </div>
    </Headless.Field>
  )
}
