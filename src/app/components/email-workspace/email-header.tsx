'use client'

import { Button } from '@/app/components/button'
import DarkModeToggle from '@/app/components/dark-mode-toggle'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/components/dialog'
import { Input } from '@/app/components/input'
import Loading from '@/app/components/loading'
import { Navbar, NavbarItem } from '@/app/components/navbar'
import Notification from '@/app/components/notification'
import { Tab, TabGroup, TabList } from '@/app/components/tab'
import LoginForm from '@/app/forms/login-form'
import RegistrationForm from '@/app/forms/registration-form'
import { addProject, updateProject } from '@/lib/database/queries/projects'
import {
  ArrowDownTrayIcon,
  BookmarkSquareIcon,
  ChevronLeftIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid'
import { render } from '@react-email/components'
import debounce from 'lodash.debounce'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../badge'
import { Heading } from '../heading'
import { useEmail } from './email-provider'
import EmailRendererFinal from './email-renderer-final'
import ExportDialog from './export-dialog'

type Props = {
  session: Session | null
  setMobileView: (mobileView: boolean) => void
  project?: Project
  monthlyExportCount: number | null
}

const EmailHeader = ({ session, project, setMobileView, monthlyExportCount }: Props) => {
  const { email, setEmail } = useEmail()
  const [emailCopy, setEmailCopy] = useState(email)
  const [stepType, setStepType] = useState<'login' | 'signup'>('signup')
  const router = useRouter()
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [showSignUpDialog, setShowSignUpDialog] = useState(false)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const [signUpAction, setSignUpAction] = useState<'send' | 'save' | 'export'>('send')
  const [showBackWarningDialog, setShowBackWarningDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const deviceOptions: { name: React.ReactNode; value: 'desktop' | 'mobile' }[] = [
    { name: <ComputerDesktopIcon className="h-5 w-5" />, value: 'desktop' },
    { name: <DevicePhoneMobileIcon className="h-5 w-5" />, value: 'mobile' },
  ]

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('template_email')
    if (savedEmail) {
      const parsedEmail: Email = JSON.parse(savedEmail)
      if (parsedEmail.name === email.name) {
        setEmail(parsedEmail)
      }
    }
  }, [email.name, setEmail])

  const handleDeviceChange = (index: number) => {
    const newValue: 'desktop' | 'mobile' = deviceOptions[index].value
    setMobileView(newValue === 'mobile')
    setSelectedDevice(newValue)
  }

  const handleShow = (action: 'send' | 'save' | 'export') => {
    setSignUpAction(action)
    setShowSignUpDialog(true)
  }

  const sendTestEmail = async () => {
    if (!session?.user?.email) {
      handleShow('send')
      return
    }

    if (!session?.user?.email || !email) return

    setEmailStatus('loading')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
          html: render(EmailRendererFinal({ email: email })),
          email: session.user.email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setEmailStatus('success')
      } else {
        setEmailStatus('error')
      }
    } catch (error) {
      setEmailStatus('error')
      console.error('Error sending email:', error)
    }
  }

  const handleAddToProjects = () => {
    if (!session?.user?.email) {
      handleShow('save')
    } else {
      setShowProjectDialog(true)
    }
  }

  const handleSaveProject = () => {
    addProject(projectTitle, email).then((project) => {
      if (project) {
        router.push(`/projects/${project.id}`)
      }
      setShowProjectDialog(false)
      setProjectTitle('')
    })
  }

  const isSaving = JSON.stringify(email) !== JSON.stringify(emailCopy)

  const debouncedSave = useCallback(
    (updatedEmail: Email) => {
      const save = debounce((email: Email) => {
        if (project) {
          setEmailCopy(email)
          updateProject(project.id.toString(), { content: email })
        } else {
          sessionStorage.setItem('template_email', JSON.stringify(email))
        }
      }, 1500)
      save(updatedEmail)
    },
    [project]
  )

  useEffect(() => {
    if (JSON.stringify(email) !== JSON.stringify(emailCopy)) {
      debouncedSave(email)
    }
  }, [debouncedSave, email, emailCopy])

  useEffect(() => {
    if (!project && !sessionStorage.getItem('template_email')) {
      sessionStorage.setItem('template_email', JSON.stringify(email))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBackClick = () => {
    if (!project) {
      if (JSON.stringify(email) !== JSON.stringify(emailCopy)) {
        setShowBackWarningDialog(true)
      } else {
        router.push('/templates')
      }
    } else {
      router.push('/projects')
    }
  }

  return (
    <>
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar className="h-16">
            <div className="flex w-full items-center">
              <div className="flex flex-1 items-center">
                <NavbarItem onClick={handleBackClick} className="ml-4 cursor-pointer">
                  <ChevronLeftIcon className="size-4" />
                  Back to {project ? 'Projects' : 'Templates'}
                </NavbarItem>
              </div>
              <div className="flex-1 text-center">
                <Heading level={1}>{project ? project.title : email.name}</Heading>
              </div>
              <div className="flex flex-1 items-center justify-end space-x-4">
                <DarkModeToggle />
                <TabGroup value={selectedDevice} className="flex justify-center" onChange={handleDeviceChange}>
                  <TabList>
                    {deviceOptions.map((option) => (
                      <Tab selected={option.value === selectedDevice} key={option.value}>
                        {option.name}
                      </Tab>
                    ))}
                  </TabList>
                </TabGroup>
                <Button
                  tooltipPosition="bottom"
                  tooltip="Send test email"
                  onClick={sendTestEmail}
                  disabled={emailStatus === 'loading'}
                >
                  {emailStatus === 'loading' ? (
                    <Loading height={24} width={24} />
                  ) : (
                    <PaperAirplaneIcon className="h-4 w-4 !text-white" />
                  )}
                </Button>
                {!project && (
                  <Button color="green" onClick={handleAddToProjects}>
                    <BookmarkSquareIcon className="h-4 w-4 !text-white" />
                    {session?.user?.email ? 'Add project' : 'Sign up to save'}
                  </Button>
                )}
                {project && isSaving && <Badge color="yellow">Saving</Badge>}
                {project && !isSaving && <Badge color="lime">Saved!</Badge>}

                <Button
                  color="blue"
                  onClick={() => (!session?.user?.email ? handleShow('export') : setShowExportDialog(true))}
                >
                  <ArrowDownTrayIcon className="!text-white" />
                  {session?.user?.email ? 'Export' : 'Sign up to export'}
                </Button>
              </div>
            </div>
          </Navbar>
        </div>
        {emailStatus === 'success' && <Notification title="Test email sent successfully!" status="success" />}
        {emailStatus === 'error' && <Notification title="Failed to send test email" status="failure" />}
      </header>
      <Dialog open={showSignUpDialog} onClose={() => setShowSignUpDialog(false)} className="z-50">
        <DialogTitle>
          {`${stepType === 'login' ? 'Log in' : 'Sign up'} to ${
            signUpAction === 'export' ? 'export' : signUpAction === 'send' ? 'test' : 'save'
          } this email${signUpAction === 'save' ? ' as a project' : ''}!`}
        </DialogTitle>
        <DialogBody className="!mt-2">
          <DialogDescription className="!mb-4">
            {signUpAction === 'send' && (
              <>
                You need to {stepType === 'login' ? 'log in' : 'sign up'} to send a test email. Create an account to
                unlock this feature and more!
              </>
            )}
            {signUpAction === 'save' && <>Access and edit your saved projects anytime, anywhere.</>}
            {signUpAction === 'export' && (
              <>
                Copy and paste the HTML, implement it directly into a react project using react-email, or send it to
                your marketing platform with one click.
              </>
            )}
          </DialogDescription>
          {stepType === 'login' && <LoginForm redirectToInitialProject onSwitchType={() => setStepType('signup')} />}
          {stepType === 'signup' && (
            <RegistrationForm redirectToInitialProject onSwitchType={() => setStepType('login')} />
          )}
        </DialogBody>
      </Dialog>
      <Dialog open={showProjectDialog} onClose={() => setShowProjectDialog(false)} className="z-50">
        <DialogTitle>Add to Projects</DialogTitle>
        <DialogBody>
          <DialogDescription>
            Give your project a title and click &quot;Add&quot; to save it to your projects.
          </DialogDescription>
          <Input
            type="text"
            placeholder="Project title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="mt-2"
          />
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowProjectDialog(false)}>Cancel</Button>
          <Button color="blue" onClick={handleSaveProject} disabled={!projectTitle.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showBackWarningDialog} onClose={() => setShowBackWarningDialog(false)} className="z-50">
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogBody>
          <DialogDescription>
            Are you sure you want to go back to Templates? Your changes will not be saved.
          </DialogDescription>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setShowBackWarningDialog(false)}>Cancel</Button>
          <Button
            color="red"
            onClick={() => {
              sessionStorage.removeItem('template_email')
              router.push('/templates')
            }}
          >
            Leave without saving
          </Button>
        </DialogActions>
      </Dialog>
      <ExportDialog
        monthlyExportCount={monthlyExportCount}
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </>
  )
}

export default EmailHeader
