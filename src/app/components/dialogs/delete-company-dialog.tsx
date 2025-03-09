import Loading from '@/app/components/loading'
import { Company } from '@/lib/database/types'
import { Button } from '../button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from './dialog'

type DeleteCompanyDialogProps = {
  open: boolean
  onClose: () => void
  company: Company | null
  isDeleting: boolean
  onConfirmDelete: () => Promise<void>
}

export function DeleteCompanyDialog({ open, onClose, company, isDeleting, onConfirmDelete }: DeleteCompanyDialogProps) {
  return (
    <Dialog darkBackdrop open={open} onClose={onClose}>
      <DialogBody>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {company?.name}? This action cannot be undone.
        </DialogDescription>
      </DialogBody>
      <DialogActions>
        <Button onClick={onClose} color="light">
          Cancel
        </Button>
        <Button onClick={onConfirmDelete} color="red">
          {isDeleting ? <Loading height={16} width={16} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
