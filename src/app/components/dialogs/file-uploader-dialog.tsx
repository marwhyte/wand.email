import { deleteFile } from '@/app/actions/deleteFile'
import { uploadFile } from '@/app/actions/uploadFile'
import { Opener } from '@/app/hooks/useOpener'
import { getFiles } from '@/lib/database/queries/files'
import { formatFileSize, getImgFromKey } from '@/lib/utils/misc'
import { TrashIcon } from '@heroicons/react/16/solid'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'
import AlertBox from '../alert-box'
import { Button } from '../button'
import Loading from '../loading'
import { Text } from '../text'
import { Dialog, DialogActions, DialogBody, DialogTitle } from './dialog'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB in bytes

type Props = {
  opener: Opener
  onUpload: (src: string) => void
}

export default function FileUploaderDialog({ opener, onUpload }: Props) {
  const fetcher = () => getFiles()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data, isLoading } = useSWR('files', fetcher)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the maximum limit of ${formatFileSize(MAX_FILE_SIZE)}.`)
      return
    }

    setIsUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadFile(formData)
      if (result.success) {
        mutate('files') // Revalidate the SWR cache
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

  const handleInputOpen = () => {
    fileInputRef.current?.click()
  }

  const handleDeleteConfirmation = (imageKey: string) => {
    setFileToDelete(imageKey)
  }

  const handleDeleteFile = async () => {
    setError(null)
    setIsDeleting(true)
    if (fileToDelete) {
      try {
        const result = await deleteFile(fileToDelete)
        if (result.success) {
          setFileToDelete(null)
          mutate('files') // Revalidate the SWR cache
        } else {
          setError(result.error || 'An error occurred while deleting the file.')
        }
      } catch (error) {
        console.error('Delete error:', error)
        setError('An error occurred while deleting the file.')
      } finally {
        setIsDeleting(false)
        setFileToDelete(null)
      }
    }
  }

  return (
    <>
      <Dialog size="5xl" open={opener.isOpen} onClose={opener.close}>
        <DialogTitle>
          <form>
            <div className="flex items-center justify-between gap-2">
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
              <Button color="purple" onClick={handleInputOpen}>
                {!isUploading && <PlusIcon />}
                {isUploading ? <Loading height={16} width={16} /> : 'Upload'}
              </Button>
            </div>
          </form>
          {error && (
            <div className="mt-2">
              <AlertBox action={{ onClick: () => setError(null), text: 'Dismiss' }} status="error">
                {error}
              </AlertBox>
            </div>
          )}
        </DialogTitle>

        <DialogBody>
          {isLoading ? (
            <div className="mx-auto flex flex-wrap gap-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex w-64 animate-pulse flex-col items-center rounded-md bg-gray-100 px-4 py-2"
                >
                  <div className="flex w-full justify-between">
                    <div className="mb-2 h-32 w-32 rounded-md bg-gray-300"></div>
                    <div className="ml-2 flex flex-col space-y-2">
                      <div className="h-4 w-20 rounded bg-gray-300"></div>
                      <div className="h-3 w-16 rounded bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="mt-2 flex w-full justify-between">
                    <div className="h-8 w-16 rounded bg-gray-300"></div>
                    <div className="h-8 w-8 rounded bg-gray-300"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto flex flex-wrap gap-4">
              {data?.map((file) => (
                <div className="flex w-64 flex-col items-center rounded-md bg-gray-100 px-4 py-2" key={file.id}>
                  <div className="flex w-full justify-between">
                    <div className="mb-2 flex h-32 !w-32 min-w-32 items-center justify-center overflow-hidden rounded-md bg-gray-200">
                      <img
                        className="max-h-full max-w-full object-contain"
                        src={getImgFromKey(file.image_key)}
                        alt={file.file_name}
                      />
                    </div>
                    <div className="ml-2">
                      <Text className="max-w-[100px] truncate !text-sm font-bold">{file.file_name}</Text>
                      <div>
                        <Text className="!text-xs text-gray-500">{formatFileSize(file.size_bytes)}</Text>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-between">
                    <Button
                      onClick={() => {
                        onUpload(getImgFromKey(file.image_key))
                        opener.close()
                      }}
                      color="purple"
                    >
                      Apply
                    </Button>
                    <div>
                      <Button onClick={() => handleDeleteConfirmation(file.image_key)} color="red">
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogBody>
      </Dialog>
      <Dialog darkBackdrop open={!!fileToDelete} onClose={() => setFileToDelete(null)}>
        <DialogBody>
          <Text>Are you sure you want to delete this file? This action cannot be undone.</Text>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setFileToDelete(null)} color="light">
            Cancel
          </Button>
          <Button onClick={handleDeleteFile} color="red">
            {isUploading ? <Loading height={16} width={16} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
