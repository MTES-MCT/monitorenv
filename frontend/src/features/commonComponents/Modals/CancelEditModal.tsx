import { Accent, Button, Dialog, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type CancelEditDialogProps = {
  onCancel: () => void
  onConfirm: () => void
  open: boolean
  subText: string
  text: string
  title: string
}
export function CancelEditDialog({ onCancel, onConfirm, open, subText, text, title }: CancelEditDialogProps) {
  return (
    open && (
      <Dialog>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Body $color={THEME.color.gunMetal}>
          <p>{text}</p>
          <Bold>{subText}</Bold>
        </Dialog.Body>

        <Dialog.Action>
          <Button accent={Accent.SECONDARY} onClick={onConfirm}>
            Quitter sans enregistrer
          </Button>
          <Button onClick={onCancel}>Retourner à l&apos;édition</Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}

const Bold = styled.p`
  font-weight: bold;
`
