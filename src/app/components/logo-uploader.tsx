import { uploadFile } from '@/app/actions/uploadFile'
import AlertBox from '@/app/components/alert-box'
import { Button } from '@/app/components/button'
import Loading from '@/app/components/loading'
import { File } from '@/lib/database/types'
import { formatFileSize } from '@/lib/utils/misc'
import { useRef, useState } from 'react'

type Props = {
  onUpload: (file: File) => void
}

const MAX_FILE_SIZE = 1024 * 1024 // 1MB in bytes

const LogoUploader = ({ onUpload }: Props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setError('Please upload only JPG or PNG image files.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}. This is the maximum size recommended for images in emails.`
      )
      return
    }

    setIsUploading(true)
    setError(null)

    // Get image dimensions
    const img = new Image()
    const imgUrl = URL.createObjectURL(file)

    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
          URL.revokeObjectURL(imgUrl)
        }
        img.onerror = () => {
          reject(new Error('Failed to load image'))
          URL.revokeObjectURL(imgUrl)
        }
        img.src = imgUrl
      })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('width', dimensions.width.toString())
      formData.append('height', dimensions.height.toString())

      const result = await uploadFile(formData, false)
      if (result.success && result.file) {
        onUpload(result.file)
      } else {
        setError(result.error || 'An error occurred while uploading the file.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('An error occurred while uploading the file.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        className="hidden"
        id="file"
        name="file"
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <Button className="mt-2" outline onClick={() => fileInputRef.current?.click()}>
        {isUploading ? <Loading height={16} width={16} /> : 'Upload Logo'}
      </Button>
      {error && (
        <div className="mt-2">
          <AlertBox action={{ onClick: () => setError(null), text: 'Dismiss' }} status="error">
            {error}
          </AlertBox>
        </div>
      )}
    </div>
  )
}

export default LogoUploader
