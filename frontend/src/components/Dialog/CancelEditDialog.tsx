import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

type CancelEditDialogProps = {
  className?: string
  onCancel: () => void
  onConfirm: () => void
  text: string | React.ReactNode
}
export function CancelEditDialog({ className, onCancel, onConfirm, text }: CancelEditDialogProps) {
  return (
    <Dialog className={className}>
      <Dialog.Title onClose={onCancel}>Quitter sans enregistrer</Dialog.Title>
      <Dialog.Body>{text}</Dialog.Body>

      <Dialog.Action>
        <Button accent={Accent.SECONDARY} onClick={onCancel}>
          Annuler
        </Button>
        <Button accent={Accent.CAUTION} onClick={onConfirm}>
          Quitter sans enregistrer
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
