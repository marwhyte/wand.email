'use client'

type Props = {
  template: Email
  onSave: (template: Email) => void
}

export default function EmailEditor({ template, onSave }: Props) {
  return (
    <div className="relative h-full w-full rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
      {/* <div className="flex flex-col gap-2 p-4">
        {options.includes(Options.TEXT) && selectedItem && 'value' in selectedItem && (
          <Field>
            <Label>Text</Label>
            <Input value={selectedItem.value} onChange={(e) => handleChange('value', e.target.value)} />
          </Field>
        )}
        {options.includes(Options.FONT_SIZE) && (
          <Field>
            <Label>Font Size</Label>
            <Input
              type="number"
              value={selectedItem?.style?.fontSize || ''}
              onChange={(e) => handleChange('style.fontSize', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.FONT_WEIGHT) && (
          <Field>
            <Label>Font Weight</Label>
            <Input
              type="number"
              value={selectedItem?.style?.fontWeight || ''}
              onChange={(e) => handleChange('style.fontWeight', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.TEXT_ALIGN) && (
          <Field>
            <Label>Text Align</Label>
            <Select
              value={selectedItem?.style?.textAlign || ''}
              onChange={(e) => handleChange('style.textAlign', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </Field>
        )}
        {options.includes(Options.TEXT_COLOR) && (
          <Field>
            <Label>Text Color</Label>
            <Input
              type="color"
              value={selectedItem?.style?.color || ''}
              onChange={(e) => handleChange('style.color', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.BACKGROUND_COLOR) && (
          <Field>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={selectedItem?.style?.backgroundColor || ''}
              onChange={(e) => handleChange('style.backgroundColor', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.WIDTH) && (
          <Field>
            <Label>Width</Label>
            <Input
              type="number"
              value={selectedItem?.style?.width || ''}
              onChange={(e) => handleChange('style.width', e.target.value)}
            />
          </Field>
        )}
        {options.includes(Options.HEIGHT) && (
          <Field>
            <Label>Height</Label>
            <Input
              type="number"
              value={selectedItem?.style?.height || ''}
              onChange={(e) => handleChange('style.height', e.target.value)}
            />
          </Field>
        )}
      </div> */}
    </div>
  )
}
