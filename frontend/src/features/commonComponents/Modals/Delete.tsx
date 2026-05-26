import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type DeleteModalProps = {
  cancelButtonText?: string
  context: string
  isAbsolute?: boolean
  onCancel: () => void
  onConfirm: () => void
  subTitle: string | React.ReactNode
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
  const isSubTitleString = typeof subTitle === 'string'

  return (
    <Dialog isAbsolute={isAbsolute}>
      <Dialog.Title onClose={onCancel}>{title}</Dialog.Title>
      <StyledBody>{isSubTitleString ? <p>{subTitle}</p> : subTitle}</StyledBody>
      <Dialog.Action>
        <Button accent={Accent.SECONDARY} name={`delete-${context}-modal-cancel`} onClick={onCancel}>
          {cancelButtonText ?? 'Annuler'}
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
`

const StyledBody = styled(Dialog.Body)`
  font-size: 16px;
`
