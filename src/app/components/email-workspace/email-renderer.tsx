'use client'

import { createNewBlock } from '@/lib/data/templates'
import { useEmailStore } from '@/lib/stores/emailStore'
import { useMobileViewStore } from '@/lib/stores/mobleViewStore'
import { generateBodyProps } from '@/lib/utils/attributes'
import { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import { v4 as uuidv4 } from 'uuid' // Make sure to import uuid
import EmailRow from './email-components/email-row'
import { ColumnBlock, Email, EmailBlockType, RowBlock } from './types'

type Props = {
  email: Email
}

const EmailRenderer = ({ email }: Props) => {
  const { setEmail } = useEmailStore()
  const { mobileView } = useMobileViewStore()
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

    setEmail({
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
      setEmail(newEmail)
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

    setEmail(newEmail)
    setDropTarget(null)
  }

  const addRow = (width: string) => {
    const newRows = [...email.rows]
    const newRow: RowBlock = {
      id: uuidv4(),
      type: 'row',
      attributes: {},
      container: {
        attributes: {},
      },
      columns: [
        {
          id: uuidv4(),
          type: 'column',
          width,
          attributes: {
            align: 'center',
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px',
            paddingRight: '10px',
          },
          blocks: [],
        },
      ],
    }

    if (dropLine === 'end' || dropLine === null) {
      newRows.push(newRow)
    } else {
      const dropIndex = newRows.findIndex((row) => row.id === dropLine)
      if (dropIndex !== -1) {
        newRows.splice(dropIndex, 0, newRow)
      } else {
        newRows.push(newRow) // Fallback to adding at the end if dropLine is not found
      }
    }

    setEmail({
      ...email,
      rows: newRows,
    })
    setDropLine(null)
  }

  const handleEmptyStateDrop = (item: {
    type: 'newBlock' | 'newRow'
    id: string
    newBlockType?: EmailBlockType
    width?: string
  }) => {
    if (item.type === 'newRow') {
      addRow(item.width ?? '100%')
    } else if (item.type === 'newBlock' && item.newBlockType) {
      const newRow: RowBlock = {
        id: uuidv4(),
        type: 'row',
        attributes: {},
        container: {
          attributes: {},
        },
        columns: [
          {
            id: uuidv4(),
            type: 'column',
            width: item.width ?? '100%',
            attributes: {
              align: 'center',
            },
            blocks: [createNewBlock(item.newBlockType)],
          },
        ],
      }
      setEmail({
        ...email,
        rows: [newRow],
      })
    }
  }

  const [{ isOver }, drop] = useDrop({
    accept: ['newBlock', 'newRow'],
    drop: handleEmptyStateDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return (
    <div className="w-full min-w-0 overflow-x-auto overflow-y-auto px-2 pt-4">
      {/* @ts-ignore */}
      <div
        {...generateBodyProps(email, true)}
        className="mx-auto"
        style={{
          backgroundColor: email.bgColor,
          color: email.color,
        }}
      >
        {email.rows.length > 0 ? (
          <>
            {email.rows.map((row) => (
              <EmailRow
                key={row.id}
                row={row}
                moveRow={moveRow}
                mobileView={mobileView}
                dropLine={dropLine}
                onHover={handleHover}
                onDragEnd={handleDragEnd}
                dropTarget={dropTarget}
                setDropTarget={setDropTarget}
                onBlockDrop={handleBlockDrop}
                addRow={addRow}
              />
            ))}
          </>
        ) : (
          <div
            // @ts-ignore
            ref={drop}
            className={`flex h-64 items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200 ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <p className={`text-lg ${isOver ? 'text-blue-500' : 'text-gray-500'}`}>
              {isOver ? 'Drop here' : 'Drag your first row or block here'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailRenderer
