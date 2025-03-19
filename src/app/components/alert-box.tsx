import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'
import { TextButton } from './button'
import { Text } from './text'

type AlertStatus = 'error' | 'success' | 'info' | 'warning'

interface AlertBoxProps {
  children: ReactNode
  status: AlertStatus
  action?: {
    onClick: () => void
    text: string
  }
}

export default function AlertBox({ children, status, action }: AlertBoxProps) {
  const config = {
    error: {
      icon: XCircleIcon,
      backgroundColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      iconColor: 'text-red-400',
    },
    success: {
      icon: CheckCircleIcon,
      backgroundColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      iconColor: 'text-green-400',
    },
    info: {
      icon: InformationCircleIcon,
      backgroundColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-400',
    },
    warning: {
      icon: ExclamationTriangleIcon,
      backgroundColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-400',
    },
  }

  const { icon: Icon, backgroundColor, borderColor, textColor, iconColor } = config[status]

  return (
    <div className={`rounded-md ${backgroundColor} border-l-4 p-4 ${borderColor}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon aria-hidden="true" className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-grow">
          <Text className={`text-sm ${textColor}`}>{children}</Text>
        </div>
        {action && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <TextButton onClick={action.onClick}>
                <span className="text-sm font-medium">{action.text}</span>
              </TextButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
