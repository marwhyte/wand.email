import { ChevronLeftIcon, ChevronRightIcon, CodeBracketIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { Button } from '../button'
import { Dialog, DialogBody, DialogTitle } from '../dialog'
import { Heading } from '../heading'
import Nbsp from '../nbsp'
import { Strong, Text, TextLink } from '../text'

type Props = {
  open: boolean
  onClose: () => void
  monthlyExportCount: number | null
}

const ExportDialog = ({ open, onClose, monthlyExportCount }: Props) => {
  const [exportType, setExportType] = useState<'react' | 'html' | null>(null)

  if (monthlyExportCount === null)
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Text>You must be logged in and have a project selected to export</Text>
        </DialogTitle>
      </Dialog>
    )

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {exportType ? (
          <Button className="-ml-4" plain onClick={() => setExportType(null)}>
            <ChevronLeftIcon className="size-4" />
            Back to exports
          </Button>
        ) : (
          'Select an export type'
        )}
      </DialogTitle>
      <DialogBody>
        {exportType === null && (
          <div className="m mb-4">
            <Text className="text-sm">
              With these options, images are hosted by SwiftMailer. <Strong>Charges may apply.</Strong>
              <Nbsp />
              <TextLink href="https://swiftmailer.com/image-hosting" target="_blank">
                Learn more
              </TextLink>
            </Text>
          </div>
        )}
        {exportType === 'react' && (
          <div>
            <div>
              <Heading level={2}>React Code</Heading>
              <div>
                <Text>Export as React code using react-email</Text>
              </div>
            </div>
          </div>
        )}
        {exportType === 'html' && (
          <div>
            <div>
              <Heading level={2}>HTML</Heading>
              <div>
                <Text>Download or copy HTML code</Text>
              </div>
            </div>
          </div>
        )}
        {exportType === null && (
          <>
            <button
              className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => {
                setExportType('react')
              }}
            >
              <div className="flex items-center">
                <img src="/react.svg" alt="React" className="mr-3 h-12 w-12" />
                <div>
                  <div className="font-semibold">React Code</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Export as React code using react-email</div>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </button>
            <button
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => {
                setExportType('html')
              }}
            >
              <div className="flex items-center">
                <CodeBracketIcon className="mr-3 h-12 w-12 text-blue-500" />
                <div>
                  <div className="font-semibold">HTML</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Download or copy HTML code</div>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </button>
          </>
        )}
      </DialogBody>
    </Dialog>
  )
}

export default ExportDialog
