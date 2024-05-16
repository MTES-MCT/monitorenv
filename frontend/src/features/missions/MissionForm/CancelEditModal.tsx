import { Accent, Button, Dialog, THEME } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

type CancelEditModalProps = {
  isAutoSaveEnabled: boolean
  isDirty: boolean
  isMissionFormValid: boolean
  onCancel: () => void
  onConfirm: () => void
  open: boolean
}
export function CancelEditModal({
  isAutoSaveEnabled,
  isDirty,
  isMissionFormValid,
  onCancel,
  onConfirm,
  open
}: CancelEditModalProps) {
  const isMissionUnsaved = !isAutoSaveEnabled && isDirty && isMissionFormValid
  const title = isMissionUnsaved ? 'Enregistrer les modifications' : 'Enregistrement impossible'

  const body = useMemo(() => {
    if (isMissionUnsaved) {
      return (
        <>
          <p>Vous êtes en train d&apos;abandonner l&apos;édition de la mission.</p>
          <p>Voulez-vous enregistrer les modifications avant de quitter ?</p>
        </>
      )
    }

    return (
      <>
        <p>Vous êtes en train d&apos;abandonner l&apos;édition de la mission.</p>
        <Bold>Si vous souhaitez enregistrer les modifications, merci de corriger les champs en erreur.</Bold>
      </>
    )
  }, [isMissionUnsaved])

  return (
    open && (
      <Dialog data-cy="cancel-edit-modal" isAbsolute>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Body $color={THEME.color.gunMetal}>{body}</Dialog.Body>

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
