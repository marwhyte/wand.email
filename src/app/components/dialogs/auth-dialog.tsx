import LoginForm from '@/app/forms/login-form'
import { Dialog, DialogBody, DialogDescription, DialogTitle } from './dialog'

type AuthDialogProps = {
  open: boolean
  onClose: () => void
  stepType: 'login' | 'signup'
  onSwitchType: (type: 'login' | 'signup') => void
}

export function AuthDialog({ open, onClose, stepType, onSwitchType }: AuthDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="z-50">
      <DialogTitle>{`${stepType === 'login' ? 'Log in' : 'Sign up'} to start creating emails`}</DialogTitle>
      <DialogBody className="!mt-2">
        <DialogDescription className="mb-4">Access and edit your saved emails anytime, anywhere.</DialogDescription>
        <LoginForm onSwitchType={() => onSwitchType('signup')} />
      </DialogBody>
    </Dialog>
  )
}
