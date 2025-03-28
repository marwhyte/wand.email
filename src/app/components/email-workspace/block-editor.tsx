'use client'

import { useCallback } from 'react'

import { Button } from '@/app/components/button'
import { Divider } from '@/app/components/divider'
import { Text } from '@/app/components/text'
import { useEmailSave } from '@/app/hooks/useEmailSave'
import { useChatStore } from '@/lib/stores/chatStore'
import { useEmailStore } from '@/lib/stores/emailStore'
import { capitalizeFirstLetter } from '@/lib/utils/misc'
import { Square2StackIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { v4 as uuidv4 } from 'uuid'
import EmailBlockEditor from './email-block-editor'
import RowEditor from './row-editor'
import {
  ButtonBlockAttributes,
  ColumnBlock,
  ColumnBlockAttributes,
  Email,
  EmailBlock,
  ImageBlockAttributes,
  ListBlockAttributes,
  PaddingAttributes,
  RowBlock,
  RowBlockAttributes,
  SocialsBlockAttributes,
  TableBlockAttributes,
  TextAttributes,
  TextBlockAttributes,
} from './types'

type BlockEditorProps = {
  email: Email
}

const BlockEditor = ({ email }: BlockEditorProps) => {
  const { currentBlock, setCurrentBlock } = useEmailStore()
  const { chatId } = useChatStore()
  const saveEmail = useEmailSave()

  const handleSave = useCallback(
    (updatedTemplate: Email) => {
      saveEmail(updatedTemplate)
    },
    [saveEmail]
  )

  const handleChange = useCallback(
    (
      attributes: Partial<
        | PaddingAttributes
        | TextAttributes
        | TextBlockAttributes
        | ImageBlockAttributes
        | ButtonBlockAttributes
        | SocialsBlockAttributes
        | TableBlockAttributes
        | ListBlockAttributes
      >
    ) => {
      if (currentBlock) {
        const updatedBlock = {
          ...currentBlock,
          attributes: { ...currentBlock.attributes, ...attributes },
        } as EmailBlock

        if ('width' in updatedBlock && 'width' in attributes) {
          updatedBlock.width = attributes.width as string
        }

        // Check if there's an actual change
        if (JSON.stringify(updatedBlock) !== JSON.stringify(currentBlock)) {
          setCurrentBlock(updatedBlock)

          const updatedEmail = {
            ...email,
            rows: email.rows.map((row) => ({
              ...row,
              columns: row.columns.map((column) => ({
                ...column,
                blocks: column.blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)),
              })),
            })),
          }

          handleSave(updatedEmail)
        }
      }
    },
    [currentBlock, setCurrentBlock, email, handleSave]
  )

  const handleColumnWidthChange = useCallback(
    (newColumns: ColumnBlock[]) => {
      if (currentBlock && currentBlock.type === 'row') {
        const updatedBlock = {
          ...currentBlock,
          columns: newColumns,
        } as RowBlock

        setCurrentBlock(updatedBlock)

        const updatedEmail = {
          ...email,
          rows: email.rows.map((row) => (row.id === updatedBlock.id ? updatedBlock : row)),
        }

        handleSave(updatedEmail)
      }
    },
    [currentBlock, setCurrentBlock, email, handleSave]
  )

  const handleColumnAttributeChange = useCallback(
    (columnId: string, attributes: Partial<ColumnBlockAttributes>) => {
      if (currentBlock && currentBlock.type === 'row') {
        const updatedBlock = {
          ...currentBlock,
          columns: currentBlock.columns.map((column) =>
            column.id === columnId ? { ...column, attributes: { ...column.attributes, ...attributes } } : column
          ),
        } as RowBlock

        setCurrentBlock(updatedBlock)

        const updatedEmail = {
          ...email,
          rows: email.rows.map((row) => (row.id === updatedBlock.id ? updatedBlock : row)),
        }

        handleSave(updatedEmail)
      }
    },
    [currentBlock, setCurrentBlock, email, handleSave]
  )

  const handleRowAttributeChange = useCallback(
    (attributes: Partial<RowBlockAttributes>) => {
      if (currentBlock && currentBlock.type === 'row') {
        const updatedBlock = {
          ...currentBlock,
          attributes: { ...currentBlock.attributes, ...attributes },
        } as RowBlock

        setCurrentBlock(updatedBlock)

        const updatedEmail = {
          ...email,
          rows: email.rows.map((row) => (row.id === updatedBlock.id ? updatedBlock : row)),
        }

        handleSave(updatedEmail)
      }
    },
    [currentBlock, setCurrentBlock, email, handleSave]
  )

  const deleteBlock = useCallback(() => {
    if (currentBlock) {
      let updatedEmail: Email
      if (currentBlock.type === 'row') {
        updatedEmail = {
          ...email,
          rows: email.rows.filter((row) => row.id !== currentBlock.id),
        }
      } else {
        updatedEmail = {
          ...email,
          rows: email.rows.map((row) => ({
            ...row,
            columns: row.columns.map((column) => ({
              ...column,
              blocks: column.blocks.filter((block) => block.id !== currentBlock.id),
            })),
          })),
        }
      }

      setCurrentBlock(null)
      handleSave(updatedEmail)
    }
  }, [currentBlock, email, setCurrentBlock, handleSave])

  const duplicateBlock = useCallback(() => {
    if (currentBlock) {
      const newBlock = {
        ...currentBlock,
        id: uuidv4(), // Generate a new ID for the duplicated block
      }

      let updatedEmail: Email
      if (newBlock.type === 'row') {
        const rowIndex = email.rows.findIndex((row) => row.id === currentBlock.id)
        updatedEmail = {
          ...email,
          rows: [...email.rows.slice(0, rowIndex + 1), newBlock as RowBlock, ...email.rows.slice(rowIndex + 1)],
        }
      } else {
        updatedEmail = {
          ...email,
          rows: email.rows.map((row) => ({
            ...row,
            columns: row.columns.map((column) => {
              const blockIndex = column.blocks.findIndex((block) => block.id === currentBlock.id)
              if (blockIndex !== -1) {
                return {
                  ...column,
                  blocks: [...column.blocks.slice(0, blockIndex + 1), newBlock, ...column.blocks.slice(blockIndex + 1)],
                }
              }
              return column
            }),
          })),
        }
      }

      setCurrentBlock(newBlock)
      handleSave(updatedEmail)
    }
  }, [currentBlock, email, setCurrentBlock, handleSave])

  if (!currentBlock) return null

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <Text>{capitalizeFirstLetter(currentBlock.type)} Properties</Text>
        <div className="flex gap-2">
          <Button onClick={deleteBlock} outline tooltip={currentBlock.type === 'row' ? 'Delete Row' : 'Delete Block'}>
            <TrashIcon className="!h-4 !w-4" />
          </Button>
          <Button
            onClick={duplicateBlock}
            outline
            tooltip={currentBlock.type === 'row' ? 'Duplicate Row' : 'Duplicate Block'}
          >
            <Square2StackIcon className="!h-4 !w-4" />
          </Button>
          <Button
            tooltipTransform="-translate-x-3/4"
            onClick={() => setCurrentBlock(null)}
            outline
            tooltip="Close Editor"
          >
            <XMarkIcon className="!h-4 !w-4" />
          </Button>
        </div>
      </div>
      <Divider className="mb-2" />
      {currentBlock.type === 'row' && (
        <RowEditor
          row={currentBlock}
          onColumnWidthChange={handleColumnWidthChange}
          onColumnAttributeChange={handleColumnAttributeChange}
          onRowAttributeChange={handleRowAttributeChange}
        />
      )}
      {currentBlock.type !== 'row' && <EmailBlockEditor block={currentBlock} onChange={handleChange} />}
    </div>
  )
}

export default BlockEditor
