import { ChangeEvent, useState } from 'react'

interface FileUploaderProps {
  onUpload: (src: string) => void
}

const FileUploader = ({ onUpload }: FileUploaderProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        onUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
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
