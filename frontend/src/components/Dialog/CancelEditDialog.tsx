import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type CancelEditDialogProps = {
  onCancel: () => void
  onConfirm: () => void
  text: string | React.ReactNode
}
export function CancelEditDialog({ onCancel, onConfirm, text }: CancelEditDialogProps) {
  return (
    <StyledDialog>
      <Dialog.Title onClose={onCancel}>Quitter sans enregistrer</Dialog.Title>
      <Dialog.Body>{text}</Dialog.Body>

      <Dialog.Action>
        <Button accent={Accent.SECONDARY} onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onConfirm}>Quitter sans enregistrer</Button>
      </Dialog.Action>
    </StyledDialog>
  )
}

const StyledDialog = styled(Dialog)`
  > div:nth-child(2) {
    min-width: 400px !important;
  }
`
