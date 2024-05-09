import { Accent, Button, Dialog, THEME } from '@mtes-mct/monitor-ui'

type CancelEditModalProps = {
  onCancel: () => void
  onConfirm: () => void
  open: boolean
}
export function CloseEditModal({ onCancel, onConfirm, open }: CancelEditModalProps) {
  return (
    open && (
      <Dialog data-cy="cancel-edit-modal" isAbsolute>
        <Dialog.Title>Enregistrer les modifications</Dialog.Title>
        <Dialog.Body $color={THEME.color.gunMetal}>
          <p>Vous êtes en train d&apos;abandonner l&apos;édition de la mission.</p>
          <p>Voulez-vous enregistrer les modifications avant de quitter ?</p>
        </Dialog.Body>

        <Dialog.Action>
          <Button accent={Accent.SECONDARY} onClick={onConfirm}>
            Quitter sans enregistrer
          </Button>
          <Button onClick={onCancel}>Retourner à l&apos;édition</Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}
