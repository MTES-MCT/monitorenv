import { Icon, Button, Accent } from '@mtes-mct/monitor-ui'
import { isNewMission } from '@utils/isNewMission'
import { useFormikContext } from 'formik'
import { type MouseEventHandler } from 'react'
import styled from 'styled-components'

import { AutoSaveTag } from './AutoSaveTag'
import { type Mission } from '../../../domain/entities/missions'

type MissionFormBottomBarProps = {
  allowClose: boolean
  allowDelete: boolean
  allowEdit: boolean
  isAutoSaveEnabled: boolean
  isFromMonitorFish: boolean
  onCloseMission: MouseEventHandler<HTMLButtonElement>
  onDeleteMission: MouseEventHandler<HTMLButtonElement>
  onQuitFormEditing: MouseEventHandler<HTMLButtonElement>
  onReopenMission: MouseEventHandler<HTMLButtonElement>
  onSaveMission: MouseEventHandler<HTMLButtonElement>
}
export function MissionFormBottomBar({
  allowClose,
  allowDelete,
  allowEdit,
  isAutoSaveEnabled,
  isFromMonitorFish,
  onCloseMission,
  onDeleteMission,
  onQuitFormEditing,
  onReopenMission,
  onSaveMission
}: MissionFormBottomBarProps) {
  const { values } = useFormikContext<Mission>()
  const missionIsNewMission = isNewMission(values?.id)

  return (
    <Footer>
      {allowDelete && (
        <StyledButton
          accent={Accent.SECONDARY}
          data-cy="delete-mission"
          disabled={isFromMonitorFish}
          Icon={Icon.Delete}
          onClick={onDeleteMission}
          type="button"
        >
          Supprimer la mission
        </StyledButton>
      )}
      <Separator />

      <Separator />

      <AutoSaveTag isAutoSaveEnabled={isAutoSaveEnabled} />
      {allowClose && allowEdit && (
        <Button
          accent={Accent.SECONDARY}
          data-cy="close-mission"
          disabled={missionIsNewMission}
          onClick={onCloseMission}
          type="button"
        >
          Clôturer
        </Button>
      )}

      <StyledButtonsContainer>
        {!allowClose && allowEdit && (
          <Button
            accent={Accent.SECONDARY}
            data-cy="reopen-mission"
            Icon={Icon.Unlock}
            onClick={onReopenMission}
            type="button"
          >
            Rouvrir la mission
          </Button>
        )}
        <Button
          accent={isAutoSaveEnabled ? Accent.PRIMARY : Accent.SECONDARY}
          data-cy="quit-edit-mission"
          onClick={onQuitFormEditing}
          type="button"
        >
          Fermer
        </Button>
        {!isAutoSaveEnabled && allowEdit && (
          <Button data-cy="save-mission" onClick={onSaveMission} type="button">
            Enregistrer
          </Button>
        )}
      </StyledButtonsContainer>
    </Footer>
  )
}

const Separator = styled.div`
  flex: 1;
`

const Footer = styled.div`
  align-items: center;
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  gap: 16px;
  padding: 16px;
`
const StyledButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
`

const StyledButton = styled(Button)`
  :not([disabled]) {
    svg {
      color: ${p => p.theme.color.maximumRed};
    }
  }
`
