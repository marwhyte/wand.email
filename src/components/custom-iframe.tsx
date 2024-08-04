"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
};

const CustomIframe = ({ children, ...props }: Props) => {
  const contentRef = useRef<HTMLIFrameElement>(null);

  const mountNode = contentRef?.current?.contentWindow?.document?.body;

  // force rerender
  const [key, setKey] = useState(0);
  const forceRerender = () => setKey((k) => k + 1);

  useEffect(() => {
    forceRerender();
  }, [children]);

  return (
    <div className="w-full h-full flex justify-center">
      <iframe {...props} width="600" height="900" ref={contentRef}>
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    </div>
  );
};

export default CustomIframe;
