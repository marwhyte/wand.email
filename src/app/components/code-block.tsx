import React from 'react'

interface CodeBlockProps {
  code: string
  language: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <pre className="code-block">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  )
}

export default CodeBlock
