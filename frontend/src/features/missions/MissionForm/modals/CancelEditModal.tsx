import { Dialog } from '@mtes-mct/monitor-ui'
import { Button } from 'rsuite'

type CancelEditModalProps = {
  isAutoSaveEnabled: boolean
  onCancel: () => void
  onConfirm: () => void
  open: boolean
}
export function CancelEditModal({ isAutoSaveEnabled, onCancel, onConfirm, open }: CancelEditModalProps) {
  return (
    open && (
      <Dialog data-cy="cancel-edit-modal" isAbsolute>
        <Dialog.Title>Enregistrer les modifications ?</Dialog.Title>
        <Dialog.Body>
          <p>Vous êtes en train d&apos;abandonner l&apos;édition d&apos;une mission.</p>
          {isAutoSaveEnabled ? (
            <p>Si vous souhaitez enregistrer les modifications, merci de corriger les champs en erreurs.</p>
          ) : (
            <p>Voulez-vous enregistrer les modifications avant de quitter ?</p>
          )}
        </Dialog.Body>

        <Dialog.Action>
          <Button appearance="ghost" onClick={onCancel}>
            Retourner à l&apos;édition
          </Button>
          <Button appearance="primary" onClick={onConfirm}>
            Quitter sans enregistrer
          </Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}
