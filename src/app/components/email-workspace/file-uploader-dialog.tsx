import { uploadFile } from '@/app/actions/uploadFile'
import { Opener } from '@/app/hooks/useOpener'
import { getFiles } from '@/lib/database/queries/files'
import { getImgFromKey } from '@/lib/utils/misc'
import { Dialog, DialogBody, DialogTitle } from '@components/dialog'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, useRef, useState } from 'react'
import useSWR from 'swr'
import { Button } from '../button'
import Loading from '../loading'
import Notification from '../notification'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB in bytes

type Props = {
  opener: Opener
  onUpload: (src: string) => void
}

export default function FileUploaderDialog({ opener, onUpload }: Props) {
  const fetcher = () => getFiles()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notification, setNotification] = useState<{ title: string; status: 'success' | 'failure' } | null>(null)

  const { data, isLoading } = useSWR({}, fetcher)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log('file', file)
    console.log('file size', file?.size, MAX_FILE_SIZE)

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setNotification({ title: 'File size exceeds 15MB limit', status: 'failure' })
        return
      }

      try {
        const result = await uploadFile(file)

        if (result.success) {
          console.log('result', result)
          const reader = new FileReader()
          reader.onloadend = () => {
            const previewUrl = reader.result as string
            console.log(previewUrl)

            onUpload(previewUrl)
            setNotification({ title: 'File uploaded successfully', status: 'success' })
          }
          reader.readAsDataURL(file)
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        setNotification({ title: 'Error uploading file', status: 'failure' })
      }
    }
  }

  return (
    <>
      <Dialog open={opener.isOpen} onClose={opener.close}>
        <DialogTitle>
          <div className="flex items-center justify-between gap-2">
            Upload File
            <Button color="blue" onClick={handleButtonClick}>
              <PlusIcon className="h-4 w-4 !text-white" />
              Upload
            </Button>
          </div>
          <input className="hidden" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
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
      {notification && (
        <Notification title={notification.title} status={notification.status} onClose={() => setNotification(null)} />
      )}
    </>
  )
}
