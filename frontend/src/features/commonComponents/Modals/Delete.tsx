import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

type DeleteModalProps = {
  cancelButtonText?: string
  context: string
  isAbsolute?: boolean
  onCancel: () => void
  onConfirm: () => void
  subTitle: string
  title: string
}

export function DeleteModal({
  cancelButtonText,
  context,
  isAbsolute = true,
  onCancel,
  onConfirm,
  subTitle,
  title
}: DeleteModalProps) {
  return (
    <Dialog isAbsolute={isAbsolute}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Body>
        <p>{subTitle}</p>
      </Dialog.Body>

      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name={`delete-${context}-modal-cancel`} onClick={onCancel}>
          {cancelButtonText ?? "Retourner à l'édition"}
        </Button>
        <Button accent={Accent.PRIMARY} name={`delete-${context}-modal-confirm`} onClick={onConfirm}>
          Confirmer la suppression
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
