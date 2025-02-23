'use client'

import { useEffect, useRef, useState } from 'react'

// Move these imports inside the component
let ReactQuill: any = null
if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill')
  require('react-quill/dist/quill.snow.css')
}

type ReactQuillElement = {
  getEditor: () => any
}

export default function Textbox({ ...props }: any) {
  const quillRef = useRef<ReactQuillElement>(null)
  const colorPickerRef = useRef<HTMLInputElement>(null)
  const [isWindowLoaded, setIsWindowLoaded] = useState(false)

  useEffect(() => {
    setIsWindowLoaded(true)
  }, [])

  useEffect(() => {
    if (!isWindowLoaded || !quillRef.current) return

    const quill = quillRef.current.getEditor()
    quill.focus()
    quill.setSelection(quill.getLength(), 0)

    const toolbar = quill.getModule('toolbar')
    const colorButton = toolbar.container.querySelector('.ql-color')

    if (colorButton && colorPickerRef.current) {
      // Get the button's dimensions and position
      const buttonRect = colorButton.getBoundingClientRect()
      const colorPicker = colorPickerRef.current

      // Style the color picker to match the button exactly
      colorPicker.style.position = 'fixed'
      colorPicker.style.top = `${buttonRect.top}px`
      colorPicker.style.left = `${buttonRect.left}px`
      colorPicker.style.width = `${buttonRect.width}px`
      colorPicker.style.height = `${buttonRect.height}px`
      colorPicker.style.opacity = '0'
      colorPicker.style.cursor = 'pointer'
      colorPicker.style.zIndex = '1000'
      colorPicker.style.display = 'block' // Make sure it's visible
      colorPicker.style.padding = '0'
      colorPicker.style.border = 'none'

      const handleColorButtonClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        colorPicker.click()
      }

      colorButton.addEventListener('click', handleColorButtonClick)

      return () => {
        colorButton.removeEventListener('click', handleColorButtonClick)
      }
    }
  }, [isWindowLoaded])

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      quill.format('color', e.target.value)
    }
  }

  return (
    <div className="relative">
      {isWindowLoaded && ReactQuill && (
        <>
          <ReactQuill
            ref={quillRef}
            className="mt-3 rounded-md"
            theme="snow"
            modules={{
              toolbar: [['bold', 'underline', 'italic'], ['color']],
            }}
            {...props}
          />
          <input
            ref={colorPickerRef}
            type="color"
            onChange={handleColorPickerChange}
            style={{
              position: 'absolute',
              opacity: '0',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </div>
  )
}
