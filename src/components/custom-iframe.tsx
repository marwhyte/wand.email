'use client'

import { Tab, TabGroup, TabList } from '@/components/tab'
import { ChevronLeftIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Heading } from './heading'

type Props = {
  children: React.ReactNode
  name: string
}

const CustomIframe = ({ children, name, ...props }: Props) => {
  const options = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

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
  const [rerender, setRerender] = useState(0)

  const resizeIframe = () => {
    if (contentRef.current) {
      const iframe = contentRef.current
      iframe.style.height = iframe.contentWindow?.document.documentElement.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    if (contentRef.current) {
      setMountNode(contentRef.current.contentWindow?.document.body || null)
      contentRef.current.onload = resizeIframe
    }
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      resizeIframe()
    }
  }, [children, rerender])

  useEffect(() => {
    // set an interval every 10 ms for one second
    const interval = setInterval(() => {
      setRerender(rerender + 1)
    }, 10)

    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 500)
    return () => clearTimeout(timeout)
  }, [rerender])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/home/templates"
          className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
        >
          <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
          Templates
        </Link>
        <Heading level={2}>{name}</Heading>
        <TabGroup onChange={handleChange}>
          <TabList>
            {options.map((option) => (
              <Tab key={option.value}>{option.name}</Tab>
            ))}
          </TabList>
        </TabGroup>
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
