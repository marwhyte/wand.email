import RcTooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'
import { ReactElement } from 'react'
import '../styles/tooltip.css'

type TooltipProps = {
  id: string
  content: string
  place?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  children?: ReactElement
}

export const Tooltip: React.FC<TooltipProps> = ({ id, content, place = 'top', className = '', children }) => {
  return (
    <RcTooltip
      id={id}
      placement={place}
      overlay={content}
      mouseEnterDelay={0}
      destroyTooltipOnHide
      align={{
        offset: [0, 5], // [x, y] offset - increase y value to move tooltip down
      }}
    >
      {children || <div data-tooltip-id={id} />}
    </RcTooltip>
  )
}
