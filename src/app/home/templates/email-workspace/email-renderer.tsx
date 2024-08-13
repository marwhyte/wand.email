'use client'

import { Body, Container, Head, Html, Preview } from '@react-email/components'
import { useState } from 'react'
import EmailRow from './email-components/email-row'

type Props = {
  email: Email
  onSave: (email: Email) => void
  renderFullEmail?: boolean
  width?: '600' | '360'
}

const EmailRenderer = ({ email, onSave, renderFullEmail = false, width = '600' }: Props) => {
  const [dropLine, setDropLine] = useState<number | null>(null)

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const newRows = [...email.rows]
    const [draggedRow] = newRows.splice(dragIndex, 1)
    newRows.splice(hoverIndex, 0, draggedRow)

    onSave({
      ...email,
      rows: newRows,
    })
    setDropLine(null)
  }

  const handleHover = (index: number, hoverClientY: number, hoverMiddleY: number) => {
    const dropIndex = hoverClientY < hoverMiddleY ? index : index + 1
    setDropLine(dropIndex)
  }

  const emailRows = email.rows.map((row, index) => (
    <EmailRow
      onSave={onSave}
      email={email}
      key={row.id}
      row={row}
      index={index}
      moveRow={moveRow}
      dropLine={dropLine}
      onHover={handleHover}
    />
  ))

  if (renderFullEmail) {
    return (
      <Html>
        <Head />
        <Preview>{email.preview}</Preview>
        <Body style={{ fontFamily: email.fontFamily, margin: 0, backgroundColor: email.bgColor }}>
          <Container>{emailRows}</Container>
        </Body>
      </Html>
    )
  }

  return (
    <div className="flex-grow overflow-scroll pt-4">
      <div>
        <div></div>
        {emailRows}
      </div>
    </div>
  )
}

export default EmailRenderer
