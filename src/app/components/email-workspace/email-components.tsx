import { Heading } from '@/app/components/heading'
import { capitalizeFirstLetter } from '@/lib/utils/misc'
import { ArrowRightCircleIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon, H1Icon, LinkIcon, PhotoIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { QueueListIcon } from '@heroicons/react/24/solid'
import { useDrag } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid'
import { EmailBlockType } from './types'

export default function EmailComponents() {
  const editableTypes: EmailBlockType[] = ['text', 'button', 'image', 'link', 'heading', 'divider', 'socials', 'survey']

  const iconForType = (type: EmailBlockType) => {
    switch (type) {
      case 'text':
        return <DocumentTextIcon className="h-10 w-10" />
      case 'image':
        return <PhotoIcon className="h-10 w-10" />
      case 'button':
        return <ArrowTopRightOnSquareIcon className="h-10 w-10" />
      case 'link':
        return <LinkIcon className="h-10 w-10" />
      case 'heading':
        return <H1Icon className="h-10 w-10" />
      case 'divider':
        return <QueueListIcon className="h-10 w-10" />
      case 'socials':
        return <ArrowRightCircleIcon className="h-10 w-10" />
      case 'survey':
        return <QuestionMarkCircleIcon className="h-10 w-10" />
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {editableTypes.map((type) => (
        <DraggableComponent key={type} type={type} icon={iconForType(type)} />
      ))}
    </div>
  )
}

function DraggableComponent({ type, icon }: { type: EmailBlockType; icon: React.ReactNode }) {
  const [, drag] = useDrag(() => ({
    type: 'newBlock',
    item: { type: 'newBlock', id: uuidv4(), newBlockType: type },
  }))

  return (
    <button
      // @ts-ignore
      ref={drag}
      className="flex flex-col items-center gap-2 rounded-md bg-zinc-100 px-2 py-4 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      {icon}
      <Heading level={2} className="!text-lg">
        {capitalizeFirstLetter(type)}
      </Heading>
    </button>
  )
}
