import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

export function CancelEditDialog({ onCancel, onConfirm, open }) {
  return (
    open && (
      <Dialog>
        <Dialog.Title>Enregistrer les modifications ?</Dialog.Title>
        <Dialog.Body>
          <p>Vous êtes en train d&apos;abandonner l&apos;édition d&apos;un signalement.</p>
          <p>Voulez-vous enregistrer les modifications avant de quitter ?</p>
        </Dialog.Body>

        <Dialog.Action>
          <Button accent={Accent.SECONDARY} onClick={onCancel}>
            Retourner à l&apos;édition
          </Button>
          <Button onClick={onConfirm}>Quitter sans enregistrer</Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}
