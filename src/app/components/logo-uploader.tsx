import { uploadFile } from '@/app/actions/uploadFile'
import AlertBox from '@/app/components/alert-box'
import { Button } from '@/app/components/button'
import Loading from '@/app/components/loading'
import { File } from '@/lib/database/types'
import { useRef, useState } from 'react'

type Props = {
  onUpload: (file: File) => void
}

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

    setIsUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
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
