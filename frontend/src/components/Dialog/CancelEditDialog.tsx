import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

type CancelEditDialogProps = {
  onCancel: () => void
  onConfirm: () => void
  text: string | React.ReactNode
}
export function CancelEditDialog({ onCancel, onConfirm, text }: CancelEditDialogProps) {
  return (
    <Dialog>
      <Dialog.Title onClose={onCancel}>Quitter sans enregistrer</Dialog.Title>
      <Dialog.Body>{text}</Dialog.Body>

      <Dialog.Action>
        <Button accent={Accent.SECONDARY} onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onConfirm}>Quitter sans enregistrer</Button>
      </Dialog.Action>
    </Dialog>
  )
}
