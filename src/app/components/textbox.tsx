'use client'

import { ComponentProps, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type Props = ComponentProps<typeof ReactQuill>

export default function Textbox({ ...props }: Props) {
  const quillRef = useRef<ReactQuill>(null)
  const colorPickerRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      const toolbar = quill.getModule('toolbar')
      const colorButton = toolbar.container.querySelector('.ql-color')

      if (colorButton) {
        // Find the parent .ql-formats div
        const formatGroup = colorButton.closest('.ql-formats')
        if (formatGroup) {
          formatGroup.style.position = 'relative'

          const colorPicker = colorPickerRef.current
          if (colorPicker) {
            colorPicker.style.position = 'absolute'
            colorPicker.style.top = '0'
            colorPicker.style.left = '0'
            colorPicker.style.width = '100%'
            colorPicker.style.height = '100%'
            colorPicker.style.opacity = '0'
            colorPicker.style.cursor = 'pointer'
            formatGroup.appendChild(colorPicker)
            colorPicker.addEventListener('click', updateColorPickerValue)
          }
        }
      }
    }
  }, [])

  const updateColorPickerValue = () => {
    if (quillRef.current && colorPickerRef.current) {
      const quill = quillRef.current.getEditor()
      const range = quill.getSelection()
      if (range) {
        const [leaf] = quill.getLeaf(range.index)
        const color = leaf.parent.domNode.style.color || '#000000'
        colorPickerRef.current.value = rgbToHex(color)
      }
    }
  }

  const rgbToHex = (rgb: string) => {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    if (match) {
      return (
        '#' +
        ((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1)
      )
    }
    return rgb
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      quill.format('color', e.target.value)
    }
  }

  return (
    <div className="relative">
      <ReactQuill
        ref={quillRef}
        className="mt-3 rounded-md"
        theme="snow"
        modules={{
          toolbar: [['bold', 'underline', 'italic'], ['color']],
        }}
        {...props}
      />
      <input ref={colorPickerRef} type="color" onChange={handleColorPickerChange} />
    </div>
  )
}
