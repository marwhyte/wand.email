'use client'

import { Button } from '@components/button'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { Heading } from './heading'

const DesktopOnly = () => {
  const route = useRouter()

  return (
    <div className="flex h-screen w-screen flex-col justify-start p-12 lg:hidden">
      <Button plain onClick={route.back} className="-ml-4 mb-4 w-[70px] cursor-pointer text-start">
        <ChevronLeftIcon className="size-4" />
        Back
      </Button>

      <Heading level={2} className="mb-12 text-center">
        The email editor is not available for small screen sizes. Access all these features on a larger device!
      </Heading>

      <img className="w-72" src="/templates.svg" alt="Templates" />
    </div>
  )
}

export default DesktopOnly
