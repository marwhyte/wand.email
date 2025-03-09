'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: React.ReactElement<any>
  id?: string
  width?: string
}

const CustomIframe = ({ children, id, width, ...props }: Props) => {
  const contentRef = useRef<HTMLIFrameElement>(null)
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null)
  const [iframeHeight, setIframeHeight] = useState<number | null>(null)

  const resizeIframe = () => {
    if (contentRef.current?.contentWindow?.document.body) {
      const body = contentRef.current.contentWindow.document.body
      const html = contentRef.current.contentWindow.document.documentElement
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )
      setIframeHeight(height + 50)
    }
  }

  useEffect(() => {
    if (contentRef.current) {
      setMountNode(contentRef.current.contentWindow?.document.body || null)
      resizeIframe()
      window.addEventListener('resize', resizeIframe)
      return () => window.removeEventListener('resize', resizeIframe)
    }
  }, [])

  useEffect(() => {
    resizeIframe()
  }, [children])

  return (
    <div>
      <div className="flex h-full w-full justify-center">
        <iframe
          {...props}
          ref={contentRef}
          width={width}
          height={iframeHeight ? `${iframeHeight}px` : undefined}
          onLoad={resizeIframe}
        >
          {mountNode && createPortal(children, mountNode)}
        </iframe>
      </div>
    </div>
  )
}

export default CustomIframe
