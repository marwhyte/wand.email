import React, { useState } from 'react'
import AlertBox from '../alert-box'
import { Button } from '../button'
import { Dialog, DialogActions, DialogButton, DialogDescription, DialogTitle } from './dialog'

interface RevertDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export const RevertDialog: React.FC<RevertDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Revert to Previous Version</DialogTitle>
      <DialogDescription className="mb-2">You are about to revert your project to a previous state.</DialogDescription>
      <AlertBox status="warning">
        This action will undo all changes made since the selected version. Your current work will be lost and cannot be
        recovered.
      </AlertBox>
      <DialogDescription className="mt-2">Are you sure you want to proceed?</DialogDescription>
      <DialogActions>
        <DialogButton type="secondary" onClick={onClose}>
          Cancel
        </DialogButton>
        <Button color="yellow" onClick={handleConfirm} disabled={isLoading} loading={isLoading}>
          Revert now
        </Button>
      </DialogActions>
    </Dialog>
  )
}
