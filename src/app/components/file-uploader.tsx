'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { uploadFile } from '../actions/uploadFile'
import { Button } from './button'

interface FileUploaderProps {
  onUpload: (src: string) => void
}

const FileUploader = ({ onUpload }: FileUploaderProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const result = await uploadFile(file)

        if (result.success) {
          // Create preview
          const reader = new FileReader()
          reader.onloadend = () => {
            const previewUrl = reader.result as string
            setImagePreview(previewUrl)
            onUpload(previewUrl)
          }
          reader.readAsDataURL(file)
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        // Handle error (e.g., show error message to user)
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <Button color="blue" onClick={handleButtonClick}>
        Upload File
      </Button>
      <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreview && (
        <div>
          <h3>Preview:</h3>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}
    </div>
  )
}

export default FileUploader
