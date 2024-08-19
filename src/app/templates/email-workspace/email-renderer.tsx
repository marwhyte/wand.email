'use client'

import { createNewBlock } from '@/lib/data/templates'
import { Body, Container, Head, Html, Preview } from '@react-email/components'
import { useCallback, useState } from 'react'
import EmailRow from './email-components/email-row'

type Props = {
  email: Email
  onSave?: (email: Email) => void
  renderFullEmail?: boolean
  width?: '600' | '360'
}

const EmailRenderer = ({ email, onSave, renderFullEmail = false, width = '600' }: Props) => {
  const [dropLine, setDropLine] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    type: 'block' | 'column'
    id: string
    position: 'above' | 'below'
  } | null>(null)

  const moveRow = (dragId: string, hoverId: string) => {
    const newRows = [...email.rows]
    const dragIndex = newRows.findIndex((row) => row.id === dragId)
    const hoverIndex = newRows.findIndex((row) => row.id === hoverId)
    const [draggedRow] = newRows.splice(dragIndex, 1)

    // Adjust the insertion index based on whether we're moving up or down
    const insertIndex = dragIndex < hoverIndex ? hoverIndex - 1 : hoverIndex
    newRows.splice(insertIndex, 0, draggedRow)

    onSave?.({
      ...email,
      rows: newRows,
    })
    setDropLine(null)
  }

  const handleHover = useCallback(
    (id: string, hoverClientY: number, hoverMiddleY: number) => {
      const hoverIndex = email.rows.findIndex((row) => row.id === id)
      const dropId = hoverClientY < hoverMiddleY ? id : email.rows[hoverIndex + 1]?.id || 'end'
      setDropLine(dropId)
    },
    [email.rows]
  )

  const handleDragEnd = () => {
    setDropLine(null)
  }

  console.log(dropTarget)

  const handleBlockDrop = (
    blockType: 'block' | 'newBlock',
    blockId: string,
    targetType: 'block' | 'column',
    targetId: string,
    position: 'above' | 'below',
    newBlockType?: EmailBlockType
  ): void => {
    if (blockType === 'newBlock' && newBlockType) {
      handleNewBlockDrop(newBlockType, targetType, targetId, position)
    } else {
      console.log('handleBlockDrop', blockId, targetType, targetId, position)
      const newEmail: Email = JSON.parse(JSON.stringify(email)) // Deep clone to avoid mutations
      let sourceRow: RowBlock | undefined
      let sourceColumn: ColumnBlock | undefined
      let sourceIndex: number | undefined
      let targetRow: RowBlock | undefined
      let targetColumn: ColumnBlock | undefined
      let targetIndex: number | undefined

      // Find the source block
      newEmail.rows.forEach((row) => {
        row.columns.forEach((column) => {
          const index = column.blocks.findIndex((block) => block.id === blockId)
          if (index !== -1) {
            sourceRow = row
            sourceColumn = column
            sourceIndex = index
          }
        })
      })

      if (!sourceRow || !sourceColumn || sourceIndex === undefined) {
        console.error('Source block not found')
        return
      }

      // Remove the block from its original position
      const [movedBlock] = sourceColumn.blocks.splice(sourceIndex, 1)

      // Find the target position
      if (targetType === 'block') {
        newEmail.rows.forEach((row) => {
          row.columns.forEach((column) => {
            const index = column.blocks.findIndex((block) => block.id === targetId)
            if (index !== -1) {
              targetRow = row
              targetColumn = column
              targetIndex = index
            }
          })
        })

        if (!targetRow || !targetColumn || targetIndex === undefined) {
          console.error('Target block not found')
          return
        }

        // Insert the block at the new position
        targetColumn.blocks.splice(position === 'above' ? targetIndex : targetIndex + 1, 0, movedBlock)
      } else if (targetType === 'column') {
        newEmail.rows.forEach((row) => {
          const columnIndex = row.columns.findIndex((column) => column.id === targetId)
          if (columnIndex !== -1) {
            targetRow = row
            targetColumn = row.columns[columnIndex]
          }
        })

        if (!targetRow || !targetColumn) {
          console.error('Target column not found')
          return
        }

        // Insert the block at the beginning or end of the column
        if (position === 'above') {
          targetColumn.blocks.unshift(movedBlock)
        } else {
          targetColumn.blocks.push(movedBlock)
        }
      }

      // Save the updated email
      onSave?.(newEmail)
      setDropTarget(null)
    }
  }

  const handleNewBlockDrop = (
    blockType: EmailBlockType,
    targetType: 'block' | 'column',
    targetId: string,
    position: 'above' | 'below'
  ) => {
    const newEmail: Email = JSON.parse(JSON.stringify(email))
    const newBlock = createNewBlock(blockType)

    let targetRow: RowBlock | undefined
    let targetColumn: ColumnBlock | undefined
    let targetIndex: number | undefined

    if (targetType === 'block') {
      newEmail.rows.forEach((row) => {
        row.columns.forEach((column) => {
          const index = column.blocks.findIndex((block) => block.id === targetId)
          if (index !== -1) {
            targetRow = row
            targetColumn = column
            targetIndex = index
          }
        })
      })

      if (!targetRow || !targetColumn || targetIndex === undefined) {
        console.error('Target block not found')
        return
      }

      targetColumn.blocks.splice(position === 'above' ? targetIndex : targetIndex + 1, 0, newBlock)
    } else if (targetType === 'column') {
      newEmail.rows.forEach((row) => {
        const columnIndex = row.columns.findIndex((column) => column.id === targetId)
        if (columnIndex !== -1) {
          targetRow = row
          targetColumn = row.columns[columnIndex]
        }
      })

      if (!targetRow || !targetColumn) {
        console.error('Target column not found')
        return
      }

      if (position === 'above') {
        targetColumn.blocks.unshift(newBlock)
      } else {
        targetColumn.blocks.push(newBlock)
      }
    }

    onSave?.(newEmail)
    setDropTarget(null)
  }

  const emailRows = email.rows.map((row, index) => (
    <EmailRow
      onSave={onSave}
      email={email}
      key={row.id}
      row={row}
      moveRow={moveRow}
      width={width}
      dropLine={dropLine}
      onHover={handleHover}
      onDragEnd={handleDragEnd}
      dropTarget={dropTarget}
      setDropTarget={setDropTarget}
      onBlockDrop={handleBlockDrop}
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
      <div>{emailRows}</div>
    </div>
  )
}

export default EmailRenderer
