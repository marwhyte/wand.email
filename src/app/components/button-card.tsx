import { Button } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { clsx } from 'clsx'
import Link from 'next/link'
import React from 'react'

interface ButtonCardProps {
  icon: string | React.ReactNode
  title: string
  description: string
  onClick?: () => void
  href?: string
  disabled?: boolean
  highlight?: boolean
}

const ButtonCard: React.FC<ButtonCardProps> = ({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  href,
  highlight = false,
}) => {
  const cardContent = (
    <>
      <div className="flex items-center">
        {typeof icon === 'string' ? <img src={icon} alt={title} className="mr-3 h-12 w-12" /> : icon}
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
        </div>
      </div>
      <ChevronRightIcon className="ml-2 h-5 w-5 text-gray-400" />
    </>
  )

  const cardClasses = clsx(
    'mb-4 flex w-full items-center justify-between rounded-lg border p-4 text-left shadow-sm transition-all disabled:opacity-50',
    highlight
      ? 'border-purple-300 bg-purple-50 hover:bg-purple-100 disabled:hover:bg-purple-50'
      : 'border-gray-200 bg-white hover:bg-gray-50 disabled:hover:bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
  )

  return (
    <>
      {href ? (
        <Link href={href} className={cardClasses}>
          {cardContent}
        </Link>
      ) : (
        <Button disabled={disabled} className={cardClasses} onClick={onClick}>
          {cardContent}
        </Button>
      )}
    </>
  )
}

export default ButtonCard
