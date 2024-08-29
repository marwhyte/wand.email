'use client'

import { deleteProject, updateProject } from '@/lib/database/queries/projects'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useCallback, useState } from 'react'
import { Button } from '../button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '../dialog'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../dropdown'
import { Input } from '../input'
import Notification from '../notification'

type Props = {
  project: {
    id: string
    title: string
  }
}

const ProjectDropdown = ({ project }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(project.title)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationProps, setNotificationProps] = useState({
    title: '',
    description: '',
    status: 'success' as 'success' | 'failure',
  })

  const handleEditProject = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await updateProject(project.id, { title: newTitle })
        setNotificationProps({
          title: 'Project updated successfully',
          description: `The project "${project.title}" has been renamed to "${newTitle}".`,
          status: 'success',
        })
        setIsEditOpen(false)
      } catch (error) {
        setNotificationProps({
          title: 'Failed to update project',
          description: 'An error occurred while updating the project. Please try again.',
          status: 'failure',
        })
      }
      setShowNotification(true)
    },
    [project.id, project.title, newTitle]
  )

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id)
      setNotificationProps({
        title: 'Project deleted successfully',
        description: `The project "${project.title}" has been deleted.`,
        status: 'success',
      })
    } catch (error) {
      setNotificationProps({
        title: 'Failed to delete project',
        description: 'An error occurred while deleting the project. Please try again.',
        status: 'failure',
      })
    }
    setShowNotification(true)
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
            <Button type="submit" color="blue">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {showNotification && (
        <Notification
          title={notificationProps.title}
          description={notificationProps.description}
          status={notificationProps.status}
          duration={5000}
        />
      )}
    </>
  )
}

export default ProjectDropdown
