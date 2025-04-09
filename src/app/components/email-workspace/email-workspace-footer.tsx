'use client'

import { useOpener } from '@/app/hooks'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import { Button } from '../button'
import { CompanySection } from '../chat/company-section'
import PreviewDialog from '../dialogs/preview-dialog'
import { ThemeColorPickerPopover } from '../theme-color-picker-popover'

export function EmailWorkspaceFooter() {
  const previewOpener = useOpener()

  return (
    <>
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-gray-200 bg-white/95 px-6 pb-3 pt-2 backdrop-blur-sm">
        <ThemeColorPickerPopover size="large" tooltip="Select theme" tooltipPosition="top" popoverDirection="up" />
        <CompanySection
          size="large"
          chat={null}
          tooltip="Select branding"
          tooltipPosition="top"
          popoverDirection="up"
        />
        <Button
          onClick={previewOpener.open}
          tooltipPosition="top"
          tooltip="Preview email"
          tooltipId="preview-email"
          plain
        >
          <ArrowsPointingOutIcon className="h-6 w-6" />
        </Button>
      </div>
      <PreviewDialog open={previewOpener.isOpen} onClose={previewOpener.close} />
    </>
  )
}
