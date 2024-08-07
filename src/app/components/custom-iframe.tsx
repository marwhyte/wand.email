'use client'

import { Tab, TabGroup, TabList } from '@/app/components/tab'
import { ChevronLeftIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/20/solid'
import { Session } from 'next-auth'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './button'
import { Heading } from './heading'

type Props = {
  children: React.ReactNode
  id?: string
  session: Session | null
}

const CustomIframe = ({ children, session, id, ...props }: Props) => {
  const options = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  const getName = () => {
    switch (id) {
      case 'going':
        return 'Going'
      default:
        break
    }
  }

  const name = getName()

  const [selected, setSelected] = useState(options[0].value)
  const [width, setWidth] = useState('600')

  const handleChange = (index: number) => {
    const newValue = options[index].value
    setSelected(newValue)

    if (newValue === 'mobile') {
      setWidth('360')
    } else {
      setWidth('600')
    }
  }

  const contentRef = useRef<HTMLIFrameElement>(null)
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)

  const sendEmail = async () => {
    if (!session?.user?.email) return

    const response = await fetch('/api/send', {
      method: 'POST',
      body: JSON.stringify({
        id: id,
        email: session?.user?.email || '',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 200) {
      console.log('email sent')
    } else {
      const error = await response.text()
      console.error(error)
    }
  }

  const resizeIframe = () => {
    if (contentRef.current) {
      const iframe = contentRef.current
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height
          iframe.style.height = `${height}px`
        }
      })

      if (iframe.contentWindow?.document.body) {
        resizeObserver.observe(iframe.contentWindow.document.body)
      }

      return () => resizeObserver.disconnect()
    }
  }

  useEffect(() => {
    if (contentRef.current) {
      setMountNode(contentRef.current.contentWindow?.document.body || null)
      const cleanup = resizeIframe()
      return cleanup
    }
  }, [])

  useEffect(() => {
    const cleanup = resizeIframe()
    return cleanup
  }, [children])

  if (!name) {
    return (
      <>
        <Heading>Template not found</Heading>
      </>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/home/templates"
          className="inline-flex w-40 items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
        >
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Templates
        </Link>
        <Heading level={2}>{name}</Heading>
        <div className="flex w-40 gap-8">
          <TabGroup onChange={handleChange}>
            <TabList>
              {options.map((option) => (
                <Tab key={option.value}>{option.name}</Tab>
              ))}
            </TabList>
          </TabGroup>

          <Button onClick={sendEmail}>Send</Button>
        </div>
      </div>

      <div className="flex h-full w-full justify-center">
        <iframe {...props} ref={contentRef} width={width}>
          {mountNode && createPortal(children, mountNode)}
        </iframe>
      </div>
    </div>
  )
}

export default CustomIframe
