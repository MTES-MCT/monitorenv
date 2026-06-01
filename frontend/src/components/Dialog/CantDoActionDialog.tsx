import { Button, Dialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type CancelEditDialogProps = {
  onClose: () => void
  text: string | React.ReactNode
  title?: string
  warningText?: string | React.ReactNode
}
export function CantDoActionDialog({ onClose, text, title, warningText }: CancelEditDialogProps) {
  return (
    <Dialog>
      <Dialog.Title onClose={onClose}>{title ?? 'Suppression impossible'}</Dialog.Title>
      <Dialog.Body>
        <p>{text}</p>
        {warningText && <WarningText>{warningText}</WarningText>}
      </Dialog.Body>

      <Dialog.Action>
        <Button onClick={onClose}>Fermer</Button>
      </Dialog.Action>
    </Dialog>
  )
}

const WarningText = styled.p`
  color: ${p => p.theme.color.maximumRed} !important;
  font-weight: 700;
`
