import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

export function DeleteModal({ onCancel, onConfirm }) {
  return (
    <Dialog isAbsolute>
      <Dialog.Title>Supprimer la mission</Dialog.Title>
      <Dialog.Body>
        <p>Êtes-vous sûr de vouloir supprimer la mission ?</p>
      </Dialog.Body>

      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name="delete-mission-modal-cancel" onClick={onCancel}>
          Retourner à l&apos;édition
        </Button>
        <Button accent={Accent.PRIMARY} name="delete-mission-modal-confirm" onClick={onConfirm}>
          Confirmer la suppression
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
