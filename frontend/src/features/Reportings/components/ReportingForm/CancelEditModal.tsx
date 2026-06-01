import { CancelEditDialog } from '@components/Dialog/CancelEditDialog'
import { Bold } from '@components/style'
import { useMemo } from 'react'
import styled from 'styled-components'

type CancelEditModalProps = {
  isAutoSaveEnabled: boolean
  isDirty: boolean
  isFormValid: boolean
  isNew: boolean
  onCancel: () => void
  onConfirm: () => void
}
export function CancelEditModal({
  isAutoSaveEnabled,
  isDirty,
  isFormValid,
  isNew,
  onCancel,
  onConfirm
}: CancelEditModalProps) {
  const isReportingUnsaved = !isAutoSaveEnabled && isDirty && isFormValid
  const body = useMemo(() => {
    if (isNew) {
      return (
        <>
          <p>Vous êtes en train d&apos;abandonner</p>
          <Bold>la création du signalement</Bold>
        </>
      )
    }
    if (isReportingUnsaved) {
      return (
        <>
          <p>
            Vous êtes en train d&apos;abandonner <Bold>l&apos;édition du signalement</Bold>
          </p>
          <RedText>et l’enregistrement automatique n’est pas actif.</RedText>
          <p>Veuillez enregistrer les modifications avant de quitter.</p>
        </>
      )
    }

    return (
      <>
        <p>
          Vous êtes en train d&apos;abandonner <Bold>l&apos;édition du signalement</Bold>
        </p>
        <RedText>et l’enregistrement automatique n’est pas actif.</RedText>
        <p>Si vous souhaitez que les modifications s’enregistrent, merci de corriger les champs en erreur.</p>
      </>
    )
  }, [isReportingUnsaved, isNew])

  return (
    <StyledCancelEditDialog
      className="styled-cancel-edit-dialog"
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

const StyledCancelEditDialog = styled(CancelEditDialog)`
  > div:nth-child(2) {
    min-width: 500px !important;
  }
`
