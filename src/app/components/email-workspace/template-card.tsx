'use client'

import { EmailContent } from './email-renderer-final'
import { Template } from './types'

type TemplateCardProps = {
  template: Template
  isSelected?: boolean
  onSelect?: (template: Template) => void
}

const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
  return (
    <div
      onClick={() => {
        sessionStorage.removeItem('template_email')
        if (onSelect) {
          onSelect(template)
        }
      }}
      className={`my-2 block cursor-pointer overflow-hidden rounded-lg border hover:outline hover:outline-blue-500 ${isSelected ? 'outline-3 scale-[1.02] outline outline-blue-500 ring-4 ring-blue-200 transition-transform' : ''}`}
    >
      <li className="col-span-1 flex w-[200px] flex-col divide-y bg-white text-center">
        <div className="flex flex-1 flex-col">
          <div className="relative h-64 w-full overflow-hidden bg-white">
            <div className="absolute inset-0 left-0">
              <div
                className="pointer-events-none flex w-full items-start justify-center"
                style={{
                  transform: 'scale(0.33)',
                  transformOrigin: 'top center',
                }}
              >
                <EmailContent email={{ ...template.template, width: '600px' }} />
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  )
}

export default TemplateCard
