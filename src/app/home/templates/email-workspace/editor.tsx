import { Button } from '@/app/components/button'
import { joinClassNames } from '@/lib/utils/misc'
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { PencilIcon, PlusIcon } from '@heroicons/react/20/solid'
import { clone } from 'lodash'
import { useEffect, useState } from 'react'
import AddBlockContainer from './AddBlockContainer'
import Block from './Block'
import { BrandingFooter } from './Branding'
import ButtonBlock from './Button'
import ImageBlock from './Image'
import SettingsSideBar from './SettingsSideBar'
import SpacerBlock from './Spacer'
import TextBlock from './Text'
import { EMAIL_BLOCK_EDITOR_SCROLL_CONTAINER_ID } from './constants'

const EmailBlockEditor = ({
  emailTemplate,
  onChange,
  disallowReferences,
  hideHeader,
  sideBarClassname,
  readonly,
  onClickReadOnly,
  small,
  disallowedBlockTypes = [],
}: {
  emailTemplate: EmailTemplateType
  onChange: (emailTemplate: EmailTemplateType) => void
  disallowReferences: boolean
  hideHeader?: boolean
  sideBarClassname?: string
  readonly?: boolean
  onClickReadOnly?: () => void
  small?: boolean
  disallowedBlockTypes?: EmailBlockType[]
}) => {
  const onChangeBlocks = (newBlocks: EmailBlockTemplateType[]) => {
    onChange({
      ...emailTemplate,
      blocks: newBlocks,
    })
  }

  const activeTheme = getActiveThemeToUse(emailTemplate)

  const blocks = emailTemplate.blocks
  const [draggingId, setDraggingId] = useState<string | undefined>(undefined)
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined)

  const [addBlockPopoverVisiableIndex, setAddBlockPopoverVisiableIndex] = useState<
    { blockId: string; position: 'top' | 'bottom' } | undefined
  >(undefined)

  const handleDragStart = ({ active }) => {
    const activeId = active.id
    setDraggingId(activeId)
    setSelectedBlockId(activeId)
  }

  const sortedIds = blocks.map((block) => block.id)

  const handleDragEnd = ({ active, over }) => {
    if (!over || !over.id) {
      setDraggingId(undefined)
      return
    }

    const activeId = active.id
    const overId = over.id

    if (activeId !== overId && draggingId) {
      const oldIndex = sortedIds.indexOf(activeId)
      const newIndex = sortedIds.indexOf(overId)

      const newSortedIds = arrayMove(sortedIds, oldIndex, newIndex)

      const newBlocks = newSortedIds.map((id) => blocks.find((block) => block.id === id)!)

      onChangeBlocks(newBlocks)
    }

    setDraggingId(undefined)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const [popoverVisible, setPopoverVisible] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div
      className={
        small ? 'largerMedium:min-w-[400px] mediumLarge:min-w-[500px] min-w-[300px] lg:min-w-[600px]' : 'min-w-[700px]'
      }
    >
      {!hideHeader && (
        <div className="mb-0 flex items-center justify-between border-b border-gray-200 px-10 pb-3 pt-3">
          <div className="flex items-center">
            <div className="mr-4 text-lg font-medium">Email layout</div>

            <AddBlockContainer
              disallowedBlockTypes={disallowedBlockTypes}
              onAddBlock={(type) => {
                const newBlock = getInitialBlock(type, getEmptySettings(type))
                onChangeBlocks([...blocks, newBlock])
                setSelectedBlockId(newBlock.id)
              }}
              popoverVisible={popoverVisible}
              setPopoverVisible={setPopoverVisible}
              placement="bottom"
            >
              <Button icon={<PlusIcon className="mr-[6px] h-4 w-4" />} theme="link" onClick={() => {}}>
                Add content
              </Button>
            </AddBlockContainer>
          </div>
        </div>
      )}

      <div
        className="flex h-full pl-4 pr-0 pt-0 lg:pl-8"
        onClick={() => {
          setSelectedBlockId(undefined)
        }}
      >
        <div
          className={joinClassNames(
            'relative mb-10 mt-5 flex h-[calc(100vh-300px)] max-h-[550px] min-h-[300px] w-full flex-col overflow-y-auto rounded-xl border-[0.5px] border-gray-300 shadow-lg'
          )}
          id={EMAIL_BLOCK_EDITOR_SCROLL_CONTAINER_ID}
          style={{
            background: emailTemplate.theme.layout === 'plain' ? '' : activeTheme.backgroundColor,
          }}
        >
          {/* This is hacky but we need the blocks (e.g. TextBlock) to render after EMAIL_BLOCK_EDITOR_SCROLL_CONTAINER_ID so that customBounds={#${EMAIL_BLOCK_EDITOR_SCROLL_CONTAINER_ID}} is respected (preventing overflow of the quill bar) */}
          {isLoaded || readonly ? (
            <div
              className="relative rounded-lg py-3"
              style={{
                background: activeTheme.questionsBackgroundColor,
              }}
              onClick={(event) => {
                // stop propagation to the parent for unselecting blocks
                event.stopPropagation()
              }}
            >
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              >
                <SortableContext items={sortedIds} strategy={rectSortingStrategy}>
                  {blocks.map((block) => {
                    let content = (
                      <div className="py-12">
                        Block: {block.type}
                        <br />
                        id: {block.id}
                      </div>
                    )

                    if (block.type === 'text') {
                      content = (
                        <TextBlock
                          disallowReferences={disallowReferences}
                          settings={block.settings as EmailTextBlockSettingsType}
                          activeTheme={activeTheme}
                          onChange={(newSettings) => {
                            const newBlocks = [...blocks]
                            const index = newBlocks.findIndex((b) => b.id === block.id)
                            newBlocks[index].settings = newSettings
                            onChangeBlocks(newBlocks)
                          }}
                        />
                      )
                    } else if (block.type === 'button') {
                      content = (
                        <ButtonBlock
                          settings={block.settings as EmailBlockButtonSettingsType}
                          activeTheme={activeTheme}
                          onChange={() => {}}
                        />
                      )
                    } else if (block.type === 'spacer') {
                      content = (
                        <SpacerBlock
                          isSelected={selectedBlockId === block.id}
                          settings={block.settings as EmailBlockSpacerSettingsType}
                        />
                      )
                    } else if (block.type === 'image') {
                      content = (
                        <ImageBlock
                          settings={block.settings as EmailImageBlockSettingsType}
                          isSelected={selectedBlockId === block.id}
                          onChange={(newSettings) => {
                            const newBlocks = [...blocks]
                            const index = newBlocks.findIndex((b) => b.id === block.id)
                            newBlocks[index].settings = newSettings
                            onChangeBlocks(newBlocks)
                          }}
                        />
                      )
                    }

                    return (
                      <Block
                        disallowedBlockTypes={disallowedBlockTypes}
                        small={small}
                        canDelete={blocks.length > 1}
                        noYPadding={block.type === 'spacer'}
                        addBlockPopoverOpen={
                          addBlockPopoverVisiableIndex?.blockId === block.id && addBlockPopoverVisiableIndex?.position
                            ? addBlockPopoverVisiableIndex?.position
                            : undefined
                        }
                        setAddBlockPopoverOpen={(value) =>
                          setAddBlockPopoverVisiableIndex(
                            value
                              ? {
                                  blockId: block.id,
                                  position: value as 'top' | 'bottom',
                                }
                              : undefined
                          )
                        }
                        onAddBlock={(position, type) => {
                          const newBlock = getInitialBlock(type, getEmptySettings(type))
                          // add block in position
                          const newBlocks = [...blocks]
                          const index = newBlocks.findIndex((b) => b.id === block.id)
                          newBlocks.splice(index + (position === 'top' ? 0 : 1), 0, newBlock)
                          onChangeBlocks(newBlocks)
                          setSelectedBlockId(newBlock.id)
                        }}
                        activeTheme={activeTheme}
                        id={block.id}
                        key={block.id}
                        isOverlay={false}
                        isSelected={selectedBlockId === block.id}
                        onSelect={() => setSelectedBlockId(block.id)}
                        isDragging={draggingId === block.id}
                        onDelete={() => {
                          onChangeBlocks(blocks.filter((b) => b.id !== block.id))
                        }}
                        onDuplicate={() => {
                          // Add after selected block id
                          const newBlock = getInitialBlock(block.type, clone(block.settings))

                          if (!selectedBlockId) {
                            onChangeBlocks([...blocks, newBlock])
                          } else {
                            const newBlocks = [...blocks]
                            const selectedBlockIndex = newBlocks.findIndex((b) => b.id === selectedBlockId)

                            newBlocks.splice(selectedBlockIndex + 1, 0, newBlock)
                            onChangeBlocks(newBlocks)
                          }
                        }}
                        onSettingsToggle={() => {}}
                      >
                        {content}
                      </Block>
                    )
                  })}
                </SortableContext>
              </DndContext>
              {readonly && (
                <div
                  className="group absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-md hover:bg-gray-700/50"
                  onClick={onClickReadOnly}
                >
                  <div className="flex h-full w-full items-center justify-center text-sm text-white opacity-0 group-hover:opacity-100">
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit email
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-10 w-[570px] items-center justify-center"></div>
          )}

          {hasBranding && <BrandingFooter activeTheme={activeTheme} />}
        </div>
        {!readonly && (
          <SettingsSideBar
            className={sideBarClassname}
            unselectBlock={() => {
              setSelectedBlockId(undefined)
            }}
            emailTemplate={emailTemplate}
            onClick={(event) => {
              // stop propagation to the parent for unselecting blocks
              event.stopPropagation()
            }}
            disallowReferences={disallowReferences}
            selectedBlock={selectedBlockId ? blocks.find((b) => b.id === selectedBlockId) : undefined}
            onChangeEmailTemplate={(newTemplate) => {
              onChange(newTemplate)
            }}
            onChangeSelectedBlockId={(newBlock) => {
              if (!newBlock) {
                setSelectedBlockId(undefined)
                return
              }
              const newBlocks = [...blocks]
              const index = newBlocks.findIndex((b) => b.id === selectedBlockId)
              newBlocks[index] = newBlock
              onChangeBlocks(newBlocks)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default EmailBlockEditor
