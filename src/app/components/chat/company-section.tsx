import { Company } from '@/lib/database/types'
import { classNames, getImgFromKey } from '@/lib/utils/misc'
import { PencilSquareIcon, PlusCircleIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Badge } from '../badge'
import { Button } from '../button'
import { Heading } from '../heading'

interface CompanySectionProps {
  companies?: Company[] | null
  selectedCompany?: Company | null
  showCompanyDialog?: (company?: Company) => void
  handleSelectCompany?: (company: Company) => void
  handleDeleteCompany?: (companyId: string) => void
}

export function CompanySection({
  companies,
  selectedCompany,
  showCompanyDialog,
  handleSelectCompany,
  handleDeleteCompany,
}: CompanySectionProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Check if the tooltip has been dismissed before
    const tooltipDismissed = localStorage.getItem('companyTooltipDismissed')

    // Only show tooltip if there are no companies and it wasn't dismissed before
    if (!companies?.length && !tooltipDismissed) {
      setShowTooltip(true)
    }
  }, [companies])

  const dismissTooltip = () => {
    setShowTooltip(false)
    localStorage.setItem('companyTooltipDismissed', 'true')
  }

  return (
    <motion.div
      id="companyDetails"
      className="relative mx-auto hidden w-full md:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-10 mt-10 flex items-center justify-center">
        <hr className="flex-grow border-gray-200" />

        <span className="px-6 text-sm font-medium leading-6 text-gray-600">
          {companies?.length ? 'Your brands' : 'Optionally'}
        </span>

        <hr className="flex-grow border-gray-200" />
      </div>

      {companies?.length ? (
        <div className="mx-auto max-w-[600px] space-y-4 px-4">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return
                handleSelectCompany?.(company)
              }}
              className={classNames(
                'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50',
                {
                  'border-blue-500 bg-blue-50/50': selectedCompany?.id === company.id,
                  'border-gray-200': selectedCompany?.id !== company.id,
                }
              )}
            >
              <div className="flex items-center space-x-4">
                {company.logoImageKey && (
                  <img
                    src={getImgFromKey(company.logoImageKey)}
                    alt={`${company.name} logo`}
                    className="h-8 min-w-8 max-w-[70px] bg-white object-contain"
                  />
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{company.name}</span>
                  {company.primaryColor && (
                    <div
                      className="h-4 w-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: company.primaryColor }}
                      title={`Primary color: ${company.primaryColor}`}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {selectedCompany?.id === company.id && <Badge color="blue">Selected</Badge>}

                <Button
                  plain
                  tooltip="Edit company"
                  onClick={() => showCompanyDialog?.(company)}
                  tooltipId="edit-company"
                >
                  <PencilSquareIcon className="h-5 w-5 !text-gray-500" />
                </Button>
                <Button
                  plain
                  tooltip="Delete company"
                  onClick={() => handleDeleteCompany?.(company.id)}
                  tooltipId="delete-company"
                >
                  <TrashIcon className="h-5 w-5 !text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <Button outline className="mt-4" onClick={() => showCompanyDialog?.()}>
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add another brand</span>
          </Button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center space-y-4 pb-4">
          <Heading className="max-w-[440px] text-center text-gray-600" level={4}>
            Add your brand identity to create professional, personalized emails
          </Heading>
          <div className="relative">
            <button
              onClick={() => showCompanyDialog?.()}
              className="relative inline-flex h-12 w-48 overflow-hidden rounded-full p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#A855F7_50%,#EC4899_100%)]" />
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm" />
              <span className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-600 transition-all hover:bg-white/80">
                Get started
              </span>
            </button>

            {showTooltip && (
              <motion.div
                className="absolute -left-8 right-0 top-16 z-10 mx-auto w-64 rounded-lg bg-blue-600 p-3 pr-5 text-center text-sm text-white shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  translateY: [0, 5, 0],
                }}
                transition={{
                  y: { duration: 0.3 },
                  translateY: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  },
                }}
              >
                <button onClick={dismissTooltip} className="absolute right-2 top-2 text-white hover:text-blue-200">
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <span>Doing this helps make your emails more personalized</span>
                <div className="absolute -top-2 left-1/2 h-3 w-3 rotate-45 bg-blue-600"></div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
