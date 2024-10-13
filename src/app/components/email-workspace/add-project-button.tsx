'use client'

import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/components/dialog'
import { Input } from '@/app/components/input'
import { addProject } from '@/lib/database/queries/projects'
import { PlusIcon } from '@heroicons/react/16/solid'
import { useRouter } from 'next/navigation'
import { ComponentProps, useState } from 'react'
import { Button } from '../button'
import ButtonCard from '../button-card'

type Props = {
  color?: ComponentProps<typeof Button>['color']
  immediateCreate?: boolean
}

export default function AddProjectButton({ color, immediateCreate }: Props) {
  const [showDialog, setShowDialog] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const [step, setStep] = useState<'type' | 'create'>(immediateCreate ? 'create' : 'type')
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
      <Button color={color ?? undefined} onClick={() => setShowDialog(true)}>
        <PlusIcon />
        {immediateCreate ? 'Create a blank project' : 'Create a project'}
      </Button>

      <Dialog
        open={showDialog}
        onClose={() => {
          setStep(immediateCreate ? 'create' : 'type')
          setShowDialog(false)
        }}
        className="z-50"
      >
        <DialogTitle>Create New Project</DialogTitle>
        <DialogBody>
          {step === 'type' ? (
            <>
              <ButtonCard
                icon="/templates.svg"
                title="Template"
                description="Choose a template with pre-built designs based on your industry or use case."
                href="/templates"
              />
              <ButtonCard
                icon="/empty-projects.svg"
                title="Blank Project"
                description="Start from scratch to create a message that resonates with your audience."
                onClick={() => setStep('create')}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </DialogBody>

        {step === 'create' && (
          <DialogActions>
            <Button onClick={() => (immediateCreate ? setShowDialog(false) : setStep('type'))}>Cancel</Button>
            <Button color="purple" onClick={handleAddProject} disabled={!projectTitle.trim()}>
              Create
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}
