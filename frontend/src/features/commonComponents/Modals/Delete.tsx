import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

type DeleteModalProps = {
  context: string
  isAbsolute?: boolean
  onCancel: () => void
  onConfirm: () => void
  open: boolean
  subTitle: string
}

export function DeleteModal({ context, isAbsolute = true, onCancel, onConfirm, open, subTitle }: DeleteModalProps) {
  if (!open) {
    return null
  }

  return (
    <Dialog isAbsolute={isAbsolute}>
      <Dialog.Title>Enregistrer les modifications ?</Dialog.Title>
      <Dialog.Body>
        <p>{subTitle}</p>
      </Dialog.Body>

      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name={`delete-${context}-modal-cancel`} onClick={onCancel}>
          Retourner à l&apos;édition
        </Button>
        <Button accent={Accent.PRIMARY} name={`delete-${context}-modal-confirm`} onClick={onConfirm}>
          Confirmer la suppression
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
