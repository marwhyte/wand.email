'use client'

import { deleteUser } from '@/lib/database/queries/users'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@components/dialogs/dialog'
import { doLogout } from '../actions/authentication'
import { Button } from '../components/button'
import { Divider } from '../components/divider'
import { Subheading } from '../components/heading'
import { Text } from '../components/text'
import { useOpener } from '../hooks/useOpener'

const DeleteAccountForm = () => {
  const dialogOpener = useOpener()

  const handleSubmit = async () => {
    await deleteUser().then(() => {
      doLogout()
    })
  }
  return (
    <form>
      <section className="grid gap-x-8 gap-y-6 rounded-lg">
        <div className="space-y-1">
          <Subheading>Delete Account</Subheading>
          <Text>This will permanently delete all your projects, images and account. This action cannot be undone.</Text>
        </div>
      </section>
      <div className="flex justify-end gap-4">
        <Button onClick={dialogOpener.open} color="red">
          Delete Account
        </Button>
      </div>
      <Divider className="my-10" soft />
      <Dialog open={dialogOpener.isOpen} onClose={dialogOpener.close}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogBody>
          <Text>
            Are you sure you want to delete your account? This action cannot be undone. All your projects, images and
            account will be permanently deleted and cannot be recovered.
          </Text>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={dialogOpener.close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleSubmit}>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default DeleteAccountForm
