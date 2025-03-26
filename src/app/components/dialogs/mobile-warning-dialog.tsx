import { Dialog, DialogActions, DialogButton, DialogDescription, DialogTitle } from './dialog'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function MobileWarningDialog({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <img className="mx-auto w-32" src="/templates.svg" alt="Templates" />

      <DialogTitle>Limited Functionality on Mobile</DialogTitle>
      <DialogDescription>
        wand.email is best on larger screens. You can create, view, and test templates here, but for full editing
        functionality, we recommend using a computer.
      </DialogDescription>
      <DialogActions>
        <DialogButton type="secondary" onClick={onClose}>
          Cancel
        </DialogButton>
        <DialogButton type="primary" onClick={onConfirm}>
          Continue Anyway
        </DialogButton>
      </DialogActions>
    </Dialog>
  )
}
