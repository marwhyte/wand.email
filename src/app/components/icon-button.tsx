import { classNames } from '@/lib/utils/misc'
import { memo } from 'react'
import { Tooltip } from './tooltip'

type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

function getIconSize(size: IconSizes) {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
    '2xl': 'h-10 w-10',
    '3xl': 'h-12 w-12',
  }

  return sizes[size]
}

interface IconButtonProps {
  icon?: React.ComponentType<{ className: string }> | null
  size?: IconSizes
  className?: string
  iconClassName?: string
  disabledClassName?: string
  disabled?: boolean
  title: string
  tooltip?: string
  tooltipId?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
}

export const IconButton = memo(
  ({
    icon: Icon,
    size = 'xl',
    className,
    iconClassName,
    disabledClassName,
    disabled = false,
    title,
    tooltip,
    tooltipId,
    tooltipPosition = 'top',
    onClick,
    children,
  }: IconButtonProps) => {
    return (
      <>
        <button
          className={classNames(
            'text-bolt-elements-item-contentDefault enabled:hover:text-bolt-elements-item-contentActive enabled:hover:bg-bolt-elements-item-backgroundActive flex items-center rounded-md bg-transparent p-1 disabled:cursor-not-allowed',
            {
              [classNames('opacity-30', disabledClassName)]: disabled,
            },
            className
          )}
          title={title}
          disabled={disabled}
          data-tooltip-id={tooltipId}
          onClick={(event) => {
            if (disabled) {
              return
            }

            onClick?.(event)
          }}
        >
          {children ?? (Icon && <Icon className={classNames(getIconSize(size), iconClassName)} />)}
        </button>
        {tooltip && tooltipId && <Tooltip id={tooltipId} place={tooltipPosition} content={tooltip} />}
      </>
    )
  }
)

IconButton.displayName = 'IconButton'

export type { IconButtonProps }
