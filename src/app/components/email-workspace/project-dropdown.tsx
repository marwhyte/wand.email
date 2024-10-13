'use client'

import { deleteProject, updateProject } from '@/lib/database/queries/projects'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useCallback, useState } from 'react'
import { Button } from '../button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '../dialog'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../dropdown'
import { Input } from '../input'

type Props = {
  project: {
    id: string
    title: string
  }
}

const ProjectDropdown = ({ project }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(project.title)

  const handleEditProject = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        await updateProject(project.id, { title: newTitle })

        setIsEditOpen(false)
      } catch (error) {}
    },
    [project.id, newTitle]
  )

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id)
    } catch (error) {}
  }

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <>
      <div onClick={handleDropdownClick}>
        <Dropdown>
          <DropdownButton className="mr-1" plain>
            <EllipsisVerticalIcon aria-hidden="true" />
          </DropdownButton>

          <DropdownMenu>
            <DropdownItem onClick={() => setIsEditOpen(true)}>Edit Project</DropdownItem>
            <DropdownItem onClick={handleDeleteProject}>Delete Project</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <form onSubmit={handleEditProject}>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogBody>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new project title"
              required
            />
          </DialogBody>
          <DialogActions>
            <Button type="button" onClick={() => setIsEditOpen(false)} color="dark/white">
              Cancel
            </Button>
            <Button type="submit" color="purple">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default ProjectDropdown
