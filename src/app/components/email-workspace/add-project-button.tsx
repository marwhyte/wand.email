'use client'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/components/dialog'
import { Input } from '@/app/components/input'
import { addProject } from '@/lib/database/queries/projects'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../button'

export default function AddProjectButton() {
  const [showDialog, setShowDialog] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const router = useRouter()

  const handleAddProject = async () => {
    if (projectTitle.trim()) {
      await addProject(projectTitle).then((project) => {
        setShowDialog(false)
        setProjectTitle('')
        router.push(`/projects/${project?.id}`)
      })
    }
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Create blank project</Button>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="z-50">
        <DialogTitle>Create New Project</DialogTitle>
        <DialogBody>
          <DialogDescription>
            Enter a name for your new project and click &quot;Create&quot; to add it to your projects.
          </DialogDescription>
          <Input
            type="text"
            placeholder="Project name"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="mt-2"
          />
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button color="blue" onClick={handleAddProject} disabled={!projectTitle.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
