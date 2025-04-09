import { Chat } from '@/lib/database/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { IconButton } from '../icon-button'

interface HistoryItemProps {
  item: Chat
  onDelete?: (event: React.UIEvent) => void
}

export function HistoryItem({ item, onDelete }: HistoryItemProps) {
  const [hovering, setHovering] = useState(false)
  const hoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined

    function mouseEnter() {
      setHovering(true)

      if (timeout) {
        clearTimeout(timeout)
      }
    }

    function mouseLeave() {
      setHovering(false)
    }

    hoverRef.current?.addEventListener('mouseenter', mouseEnter)
    hoverRef.current?.addEventListener('mouseleave', mouseLeave)

    return () => {
      hoverRef.current?.removeEventListener('mouseenter', mouseEnter)
      hoverRef.current?.removeEventListener('mouseleave', mouseLeave)
    }
  }, [])

  return (
    <div
      ref={hoverRef}
      className="group flex items-center justify-between overflow-hidden rounded-md px-2 py-1 text-gray-700 hover:bg-gray-200"
    >
      <a href={`/chat/${item.id}`} className="relative flex w-full truncate">
        {item.title}
        <div className="absolute bottom-0 right-0 top-0 flex w-10 justify-end bg-gradient-to-l from-gray-50 from-50% to-transparent transition-all duration-150 group-hover:w-[60px] group-hover:from-gray-200">
          {hovering && (
            <div className="flex items-center p-1 text-gray-600 hover:text-red-600">
              <IconButton
                title="Delete"
                onClick={(event) => {
                  event.preventDefault()
                  onDelete?.(event)
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </IconButton>
            </div>
          )}
        </div>
      </a>
    </div>
  )
}
