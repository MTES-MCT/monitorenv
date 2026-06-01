import { Bold } from '@components/style'
import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type DeleteModalProps = {
  context: string
  isAbsolute?: boolean
  onCancel: () => void
  onConfirm: () => void
  textLine1?: string | React.ReactNode
  textLine2: string | React.ReactNode
  title: string
}

export function DeleteDialog({
  context,
  isAbsolute = true,
  onCancel,
  onConfirm,
  textLine1,
  textLine2,
  title
}: DeleteModalProps) {
  return (
    <StyledDialog isAbsolute={isAbsolute}>
      <Dialog.Title onClose={onCancel}>{title}</Dialog.Title>
      <Dialog.Body>
        <p>{textLine1 ?? 'Êtes-vous sûr de vouloir'}</p>
        <Bold>{textLine2}</Bold>
      </Dialog.Body>
      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name={`delete-${context}-modal-cancel`} onClick={onCancel}>
          Annuler
        </Button>
        <Button accent={Accent.ERROR} name={`delete-${context}-modal-confirm`} onClick={onConfirm}>
          Confirmer la suppression
        </Button>
      </Dialog.Action>
    </StyledDialog>
  )
}

const StyledDialog = styled(Dialog)`
  > div:nth-child(2) {
    min-width: 400px !important;
  }
`
