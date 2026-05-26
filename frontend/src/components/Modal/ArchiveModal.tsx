import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

type ArchiveModalProps = {
  context: string
  isAbsolute?: boolean
  onCancel: () => void
  onConfirm: () => void
  subTitle: string | React.ReactNode
  title: string
}

export function ArchiveModal({ context, isAbsolute = true, onCancel, onConfirm, subTitle, title }: ArchiveModalProps) {
  return (
    <Dialog isAbsolute={isAbsolute}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Body>{subTitle}</Dialog.Body>
      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name={`archive-${context}-modal-cancel`} onClick={onCancel}>
          Annuler
        </Button>
        <Button accent={Accent.PRIMARY} name={`archive-${context}-modal-confirm`} onClick={onConfirm}>
          Archiver
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
