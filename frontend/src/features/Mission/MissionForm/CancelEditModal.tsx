import { Accent, Button, Dialog, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type CancelEditModalProps = {
  onCancel: () => void
  onConfirm: () => void
  open: boolean
}
export function CancelEditModal({ onCancel, onConfirm, open }: CancelEditModalProps) {
  return (
    open && (
      <Dialog data-cy="cancel-edit-modal" isAbsolute>
        <Dialog.Title>Enregistrement impossible</Dialog.Title>
        <Dialog.Body $color={THEME.color.gunMetal}>
          <p>Vous êtes en train d&apos;abandonner l&apos;édition de la mission.</p>
          <Bold>Si vous souhaitez enregistrer les modifications, merci de corriger les champs en erreur.</Bold>
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
