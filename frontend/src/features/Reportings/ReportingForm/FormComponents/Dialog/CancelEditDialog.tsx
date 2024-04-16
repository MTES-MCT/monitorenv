import { Accent, Button, Dialog, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function CancelEditDialog({ onCancel, onConfirm, open }) {
  return (
    open && (
      <Dialog>
        <Dialog.Title>Enregistrement impossible</Dialog.Title>
        <Dialog.Body $color={THEME.color.gunMetal}>
          <p>Vous êtes en train d&apos;abandonner l&apos;édition du signalement.</p>
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
