import { Button } from '@/app/components/button'
import { PlusIcon } from '@heroicons/react/20/solid'

type DragLineProps = {
  direction: 'above' | 'below'
}

const DragLine = ({ direction }: DragLineProps) => {
  return (
    <div
      className="absolute left-0 right-0 z-10"
      style={{ transform: 'translateY(-50%)', top: direction === 'above' ? 0 : '100%' }}
    >
      <div className="flex items-center justify-center">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-2 border-t border-blue-400" />
        </div>
        <div className="relative flex justify-center">
          <Button
            color="blue"
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
          >
            <PlusIcon aria-hidden="true" className="-ml-1 -mr-0.5 h-5 w-5" />
            Drop here
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DragLine
