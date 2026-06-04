import { CancelEditDialog } from '@components/Dialog/CancelEditDialog'
import { Bold } from '@components/style'
import { useMemo } from 'react'
import styled from 'styled-components'

type CancelEditModalProps = {
  isAutoSaveEnabled: boolean
  isDirty: boolean
  isMissionFormValid: boolean
  isNew: boolean
  onCancel: () => void
  onConfirm: () => void
}
export function CancelEditModal({
  isAutoSaveEnabled,
  isDirty,
  isMissionFormValid,
  isNew,
  onCancel,
  onConfirm
}: CancelEditModalProps) {
  const isMissionUnsaved = !isAutoSaveEnabled && isDirty && isMissionFormValid
  const body = useMemo(() => {
    if (isNew) {
      return (
        <>
          <p>Vous êtes en train d&apos;abandonner</p>
          <Bold>la création de la mission.</Bold>
        </>
      )
    }
    if (isMissionUnsaved) {
      return (
        <>
          <p>
            Vous êtes en train d&apos;abandonner <Bold>l&apos;édition de la mission</Bold>
          </p>
          <RedText>et l’enregistrement automatique n’est pas actif.</RedText>
          <p>Veuillez enregistrer les modifications avant de quitter.</p>
        </>
      )
    }

    return (
      <>
        <p>
          Vous êtes en train d&apos;abandonner <Bold>l&apos;édition de la mission</Bold>
        </p>
        <RedText>et l’enregistrement automatique n’est pas actif.</RedText>
        <p>Si vous souhaitez que les modifications s’enregistrent, merci de corriger les champs en erreur.</p>
      </>
    )
  }, [isMissionUnsaved, isNew])

  return (
    <CancelEditDialog
      className="styled-cancel-edit-dialog"
      data-cy="cancel-edit-modal"
      onCancel={onCancel}
      onConfirm={onConfirm}
      text={body}
    />
  )
}

const RedText = styled(Bold)`
  color: ${p => p.theme.color.maximumRed};
  padding-bottom: 4px;
`
