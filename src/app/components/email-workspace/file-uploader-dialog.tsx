import { uploadFile } from '@/app/actions/uploadFile'
import { Opener } from '@/app/hooks/useOpener'
import { getFiles } from '@/lib/database/queries/files'
import { getImgFromKey } from '@/lib/utils/misc'
import { Dialog, DialogBody, DialogTitle } from '@components/dialog'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Button } from '../button'
import Loading from '../loading'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB in bytes

type Props = {
  opener: Opener
  onUpload: (src: string) => void
}

const initialState = { success: false, error: '', message: undefined }

export default function FileUploaderDialog({ opener, onUpload }: Props) {
  const fetcher = () => getFiles()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data, isLoading } = useSWR('files', fetcher)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadFile(formData)
      if (result.success) {
        mutate('files') // Revalidate the SWR cache
      } else {
        // Handle error
        console.error('Upload failed:', result.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputOpen = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <Dialog open={opener.isOpen} onClose={opener.close}>
        <DialogTitle>
          <div className="flex items-center justify-between gap-2">
            <form>
              Upload File
              <input
                className="hidden"
                ref={fileInputRef}
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button color="blue" onClick={handleInputOpen}>
                <PlusIcon />
                Upload
              </Button>
            </form>
          </div>
        </DialogTitle>

        <DialogBody>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-2">
              {data?.map((file) => (
                <div className="rounded-md bg-gray-100 p-2" key={file.id}>
                  <img src={getImgFromKey(file.image_key)} alt={file.file_name} />
                  {file.file_name}
                </div>
              ))}
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  )
}
