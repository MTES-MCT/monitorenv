import { saveDashboard } from '@features/Dashboard/useCases/saveDashboard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Dialog, Icon, TextInput, THEME } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

export function Footer() {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const dashboardForm = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards[activeDashboardId] : undefined
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updatedName, setUpdatedName] = useState<string | undefined>(dashboardForm?.dashboard.name)
  if (!dashboardForm) {
    return null
  }

  const save = () => {
    dispatch(saveDashboard({ ...dashboardForm.dashboard, name: updatedName ?? dashboardForm.dashboard.name }))
    setIsModalOpen(false)
  }

  return (
    <>
      {isModalOpen && (
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
            <Button accent={Accent.SECONDARY} onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button Icon={Icon.Save} onClick={save}>
              Enregistrer
            </Button>
          </StyledDialogActions>
        </Dialog>
      )}
      <Wrapper>
        <SaveButton
          accent={Accent.SECONDARY}
          disabled={!activeDashboardId}
          Icon={Icon.Save}
          onClick={() => setIsModalOpen(true)}
        >
          Enregistrer le tableau
        </SaveButton>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0pc 3px 6px #00000029;
  padding: 16px 24px;

  position: sticky;
  bottom: 0;
`

const SaveButton = styled(Button)`
  float: right;
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
