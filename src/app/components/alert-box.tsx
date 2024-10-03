import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

type AlertStatus = 'error' | 'success' | 'information' | 'warning'

interface AlertBoxProps {
  children: ReactNode
  status: AlertStatus
}

export default function AlertBox({ children, status }: AlertBoxProps) {
  const config = {
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      iconColor: 'text-red-400',
    },
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      iconColor: 'text-green-400',
    },
    information: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-400',
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-400',
    },
  }

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[status]

  return (
    <div className={`rounded-md ${bgColor} border-l-4 p-4 ${borderColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon aria-hidden="true" className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3">
          <p className={`text-sm ${textColor}`}>{children}</p>
        </div>
      </div>
    </div>
  )
}
