import LoginForm from '@/app/forms/login-form'
import { Logo } from '../Logo'
import { Dialog, DialogBody, DialogTitle } from './dialog'

type AuthDialogProps = {
  open: boolean
  onClose: () => void
  stepType: 'login' | 'signup'
  onSwitchType: (type: 'login' | 'signup') => void
}

export function AuthDialog({ open, onClose, stepType, onSwitchType }: AuthDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="z-50">
      <DialogTitle>
        <Logo className="mx-auto mb-8" icon />
      </DialogTitle>
      <DialogBody className="!mt-4">
        <LoginForm />
      </DialogBody>
    </Dialog>
  )
}
