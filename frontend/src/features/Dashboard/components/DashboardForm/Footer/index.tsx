import { useGenerateBrief } from '@features/Dashboard/hooks/useGenerateBrief'
import { useGenerateEditableBrief } from '@features/Dashboard/hooks/useGenerateEditableBrief'
import { deleteDashboard } from '@features/Dashboard/useCases/deleteDashboard'
import { saveDashboard } from '@features/Dashboard/useCases/saveDashboard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useTracking } from '@hooks/useTracking'
import { Accent, Button, Dialog, Dropdown, Icon, TextInput, THEME } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { CreateMailButton } from './CreateMailButton'

import type { DashboardType } from '@features/Dashboard/slice'

type FooterProps = {
  dashboardForm: [string, DashboardType]
}

export function Footer({ dashboardForm: [key, dashboard] }: FooterProps) {
  const dispatch = useAppDispatch()

  const { trackEvent } = useTracking()
  const { downloadPdf, generateBrief, isLoadingBrief, loadingImages } = useGenerateBrief(dashboard.dashboard)
  const { downloadEditableBrief, isLoadingEditableBrief } = useGenerateEditableBrief(dashboard.dashboard)

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [updatedName, setUpdatedName] = useState<string | undefined>(dashboard.dashboard.name)

  const save = () => {
    dispatch(saveDashboard({ ...dashboard.dashboard, name: updatedName ?? dashboard.dashboard.name }))
    setIsSaveDialogOpen(false)
  }

  const handleSave = () => {
    const hasDefaultName = dashboard.defaultName === dashboard.dashboard.name && !dashboard.dashboard.createdAt
    if (hasDefaultName) {
      setIsSaveDialogOpen(true)
    } else {
      dispatch(saveDashboard({ ...dashboard.dashboard }))
    }
  }

  const confirmDelete = () => {
    dispatch(deleteDashboard(key, dashboard.dashboard))

    setIsDeleteDialogOpen(false)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const getLoadingText = () => {
    if (loadingImages) {
      return 'Chargement des images'
    }
    if (isLoadingBrief || isLoading) {
      return 'Chargement du brief'
    }

    return 'Télécharger le brief'
  }

  const createPdf = async () => {
    const brief = await generateBrief()
    downloadPdf(brief)
    trackEvent({
      action: 'Téléchargement du brief',
      category: 'TABLEAU DE BORD & BRIEF',
      name: 'Téléchargement du brief'
    })
  }

  const createEditableDoc = async () => {
    downloadEditableBrief()
  }

  const isLoading = isLoadingBrief || isLoadingEditableBrief || loadingImages

  return (
    <>
      {isSaveDialogOpen && (
        <Dialog isAbsolute>
          <Dialog.Title as="h2">Enregistrer le tableau de bord</Dialog.Title>
          <Dialog.Body $color={THEME.color.gunMetal}>
            <StyledDialogMessage>
              Voulez-vous modifier le nom par défaut du tableau de bord avant de l&apos;enregistrer ?
            </StyledDialogMessage>
            <StyledTextInput
              isLabelHidden
              label="Nom du tableau de bord"
              name="name"
              onChange={value => setUpdatedName(value)}
              value={updatedName}
            />
          </Dialog.Body>
          <StyledDialogActions>
            <Button accent={Accent.SECONDARY} onClick={() => setIsSaveDialogOpen(false)}>
              Annuler
            </Button>
            <Button Icon={Icon.Save} onClick={save}>
              Enregistrer
            </Button>
          </StyledDialogActions>
        </Dialog>
      )}
      {isDeleteDialogOpen && (
        <Dialog isAbsolute>
          <Dialog.Title as="h2">Supprimer le tableau de bord</Dialog.Title>
          <Dialog.Body $color={THEME.color.gunMetal}>
            <StyledDialogMessage>Êtes-vous sûr de vouloir supprimer le tableau de bord ?</StyledDialogMessage>
          </Dialog.Body>
          <StyledDialogActions>
            <Button accent={Accent.SECONDARY} onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={confirmDelete}>Supprimer</Button>
          </StyledDialogActions>
        </Dialog>
      )}
      <Wrapper>
        <DeleteButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={handleDelete}>
          Supprimer le tableau
        </DeleteButton>

        <ButtonsWrapper>
          <CreateMailButton dashboard={dashboard.dashboard} />
          <StyledDropdown
            disabled={isLoading}
            Icon={isLoading ? Icon.Reset : Icon.Download}
            noCaret
            placement="topStart"
            title={getLoadingText()}
          >
            <StyledDropdownItem onClick={createPdf}>PDF</StyledDropdownItem>
            <Dropdown.Item onClick={createEditableDoc}>ODT</Dropdown.Item>
          </StyledDropdown>
          <Button accent={Accent.SECONDARY} Icon={Icon.Save} onClick={handleSave}>
            Enregistrer le tableau
          </Button>
        </ButtonsWrapper>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0pc 3px 6px #00000029;
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  position: sticky;
  bottom: 0;
`

const ButtonsWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: end;
`

const DeleteButton = styled(Button)`
  svg {
    color: ${p => p.theme.color.maximumRed};
  }
`
const StyledTextInput = styled(TextInput)`
  margin-top: 24px;
  width: 360px;
  margin: 24px auto 0;
`

const StyledDialogMessage = styled.p`
  font-size: 16px;
`

const StyledDialogActions = styled(Dialog.Action)`
  align-items: stretch;
`

const StyledDropdown = styled(Dropdown)`
  > .rs-btn {
    padding: 5px 12px 6px;
    ${p =>
      p.disabled &&
      `@keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  > .Element-IconBox > svg {
    animation: spin 2s linear infinite;
    transform-origin: center;
  }`}
  }
`

const StyledDropdownItem = styled(Dropdown.Item)`
  width: 175px;
`
