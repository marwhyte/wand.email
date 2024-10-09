'use client'

import { useOpener } from '../hooks/useOpener'
import { Button } from './button'
import FileUploaderDialog from './email-workspace/file-uploader-dialog'

interface FileUploaderProps {
  onUpload: (src: string) => void
}

const FileUploader = ({ onUpload }: FileUploaderProps) => {
  const opener = useOpener()

  return (
    <div>
      {opener.isOpen && <FileUploaderDialog onUpload={onUpload} opener={opener} />}
      <Button color="blue" onClick={opener.open}>
        Choose a file
      </Button>
    </div>
  )
}

export default FileUploader
