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
  const [dropLine, setDropLine] = useState<string | null>(null)

  const moveRow = (dragId: string, hoverId: string) => {
    const newRows = [...email.rows]
    const dragIndex = newRows.findIndex((row) => row.id === dragId)
    const hoverIndex = newRows.findIndex((row) => row.id === hoverId)
    const [draggedRow] = newRows.splice(dragIndex, 1)

    // Adjust the insertion index based on whether we're moving up or down
    const insertIndex = dragIndex < hoverIndex ? hoverIndex - 1 : hoverIndex
    newRows.splice(insertIndex, 0, draggedRow)

    onSave({
      ...email,
      rows: newRows,
    })
    setDropLine(null)
  }

  const handleHover = (id: string, hoverClientY: number, hoverMiddleY: number) => {
    const hoverIndex = email.rows.findIndex((row) => row.id === id)
    const dropId = hoverClientY < hoverMiddleY ? id : email.rows[hoverIndex + 1]?.id || 'end'
    setDropLine(dropId)
  }

  const handleDragEnd = () => {
    setDropLine(null)
  }

  const emailRows = email.rows.map((row, index) => (
    <EmailRow
      onSave={onSave}
      email={email}
      key={row.id}
      row={row}
      moveRow={moveRow}
      dropLine={dropLine}
      onHover={handleHover}
      onDragEnd={handleDragEnd}
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
