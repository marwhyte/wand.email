import { Chat } from '@/lib/database/types'
import { useChatStore } from '@/lib/stores/chatStore'
import { getImgFromKey } from '@/lib/utils/misc'
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { Text } from '../text'
import { ThemeColorPickerPopover } from '../theme-color-picker-popover'
import { CompanySection } from './company-section'

interface OutlineHeaderProps {
  emailType: string

  chat: Chat | null | undefined
}

export function OutlineHeader({ emailType, chat }: OutlineHeaderProps) {
  const { company, themeColor } = useChatStore()

  return (
    <div className="mt-6 flex items-center gap-2">
      <ThemeColorPickerPopover popoverDirection="up">
        <div className="flex h-12 w-full cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50">
          <Text className="text-xs font-bold !text-gray-600">Theme:</Text>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md" style={{ backgroundColor: themeColor }} />
            <div className="h-7 w-7">
              <img
                src="/border-radius.svg"
                alt="Border Radius Icon"
                className="h-full w-full"
                style={{ filter: 'brightness(0) saturate(100%) invert(50%)' }}
              />
            </div>
          </div>
        </div>
      </ThemeColorPickerPopover>

      <CompanySection chat={chat} popoverDirection="up">
        <div className="flex h-12 w-full cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50">
          {company && <Text className="text-xs font-bold !text-gray-600">Branding:</Text>}
          <div className="flex items-center gap-2">
            {company ? (
              <>
                <img
                  src={company.logoImageKey ? getImgFromKey(company.logoImageKey) : getImgFromKey('dummy-logo.png')}
                  alt={`${company.name} logo`}
                  className={clsx(
                    'h-8 object-contain',
                    company.logoWidth != null && company.logoHeight != null
                      ? company.logoWidth > company.logoHeight
                        ? 'w-12' // Wider image
                        : company.logoWidth === company.logoHeight
                          ? 'w-8' // Square image
                          : 'w-8' // Taller image
                      : 'w-8' // Default to wider for dummy logo
                  )}
                />
                <PencilIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                <Text className="text-xs font-bold !text-gray-600">Add branding</Text>
              </>
            )}
          </div>
        </div>
      </CompanySection>
    </div>
  )
}
