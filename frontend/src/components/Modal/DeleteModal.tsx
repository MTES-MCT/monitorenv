import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type DeleteModalProps = {
  context: string
  isAbsolute?: boolean
  onCancel: () => void
  onConfirm: () => void
  subTitle: string | React.ReactNode
  title: string
}

export function DeleteModal({ context, isAbsolute = true, onCancel, onConfirm, subTitle, title }: DeleteModalProps) {
  return (
    <Dialog isAbsolute={isAbsolute}>
      <Dialog.Title onClose={onCancel}>{title}</Dialog.Title>
      <Dialog.Body>{subTitle}</Dialog.Body>
      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name={`delete-${context}-modal-cancel`} onClick={onCancel}>
          Annuler
        </Button>
        <ConfirmDeleteButton accent={Accent.PRIMARY} name={`delete-${context}-modal-confirm`} onClick={onConfirm}>
          Confirmer la suppression
        </ConfirmDeleteButton>
      </Dialog.Action>
    </Dialog>
  )
}

const ConfirmDeleteButton = styled(Button)`
  background-color: ${p => p.theme.color.maximumRed};
  border-color: ${p => p.theme.color.maximumRed};
`
