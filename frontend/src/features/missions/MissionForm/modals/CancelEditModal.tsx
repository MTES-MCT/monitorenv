import { Dialog } from '@mtes-mct/monitor-ui'
import { Button } from 'rsuite'

export function CancelEditModal({ onCancel, onConfirm, open }) {
  return (
    open && (
      <Dialog isAbsolute>
        <Dialog.Title>Enregistrer les modifications ?</Dialog.Title>
        <Dialog.Body>
          <p>Vous êtes en train d&apos;abandonner l&apos;édition d&apos;une mission.</p>
          <p>Voulez-vous enregistrer les modifications avant de quitter ?</p>
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
