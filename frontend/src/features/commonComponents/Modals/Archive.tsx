import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'

type ArchiveModalProps = {
  context: string
  isAbsolute?: boolean
  onCancel: () => void
  onConfirm: () => void
  open: boolean
  subTitle: string
  title: string
}

export function ArchiveModal({
  context,
  isAbsolute = true,
  onCancel,
  onConfirm,
  open,
  subTitle,
  title
}: ArchiveModalProps) {
  if (!open) {
    return null
  }

  return (
    <Dialog isAbsolute={isAbsolute}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Body>
        <p>{subTitle}</p>
      </Dialog.Body>

      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name={`archive-${context}-modal-cancel`} onClick={onCancel}>
          Annuler l&apos;archivage
        </Button>
        <Button accent={Accent.PRIMARY} name={`archive-${context}-modal-confirm`} onClick={onConfirm}>
          Enregistrer et archiver
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
