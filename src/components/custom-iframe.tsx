'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: React.ReactNode
}

const CustomIframe = ({ children, ...props }: Props) => {
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
      <div className="flex h-full w-full justify-center">
        <iframe {...props} ref={contentRef} width="600">
          {mountNode && createPortal(children, mountNode)}
        </iframe>
      </div>
    </div>
  )
}

export default CustomIframe
