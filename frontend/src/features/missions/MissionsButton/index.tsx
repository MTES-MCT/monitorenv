import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setDisplayedItems, setReportingFormVisibility } from '../../../domain/shared_slices/Global'
import { ReportingFormVisibility } from '../../../domain/shared_slices/ReportingState'
import { addMission } from '../../../domain/use_cases/missions/addMission'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { sideWindowActions, SideWindowStatus } from '../../SideWindow/slice'

export function MissionsMenu() {
  const dispatch = useDispatch()
  const { displayMissionsLayer, isSearchMissionsVisible, reportingFormVisibility } = useAppSelector(
    state => state.global
  )
  const { sideWindow } = useAppSelector(state => state)

  const toggleMissionsWindow = () => {
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  }
  const toggleMissionsLayer = () => {
    dispatch(setDisplayedItems({ displayMissionsLayer: !displayMissionsLayer }))
  }
  const toggleMissionsMenu = e => {
    e.preventDefault()
    dispatch(
      setDisplayedItems({
        isSearchMissionsVisible: !isSearchMissionsVisible,
        isSearchReportingsVisible: false,
        isSearchSemaphoreVisible: false
      })
    )
    if (reportingFormVisibility !== ReportingFormVisibility.NONE) {
      dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCED))
    }
  }
  const handleAddNewMission = () => {
    dispatch(addMission())
  }

  return (
    <Wrapper reportingFormVisibility={reportingFormVisibility}>
      {isSearchMissionsVisible && (
        <MenuWithCloseButton.Container>
          <MenuWithCloseButton.Header>
            <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={toggleMissionsMenu} />
            <MenuWithCloseButton.Title>Missions et contrôles</MenuWithCloseButton.Title>
            <MenuWithCloseButton.VisibilityButton
              accent={Accent.SECONDARY}
              Icon={displayMissionsLayer ? Icon.Display : Icon.Hide}
              onClick={toggleMissionsLayer}
            />
          </MenuWithCloseButton.Header>
          <MenuWithCloseButton.Body>
            <MenuWithCloseButton.Section>
              <StyledButton Icon={Icon.Plus} isFullWidth onClick={handleAddNewMission}>
                Ajouter une nouvelle mission
              </StyledButton>
            </MenuWithCloseButton.Section>
            <MenuWithCloseButton.Section>
              <StyledButton accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={toggleMissionsWindow}>
                Voir la vue détaillée des missions
              </StyledButton>
            </MenuWithCloseButton.Section>
          </MenuWithCloseButton.Body>
        </MenuWithCloseButton.Container>
      )}
      <MenuWithCloseButton.ButtonOnMap
        className={sideWindow.status !== SideWindowStatus.CLOSED ? '_active' : undefined}
        data-cy="missions-button"
        Icon={Icon.MissionAction}
        onClick={toggleMissionsMenu}
        size={Size.LARGE}
        title="voir les missions"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div<{ reportingFormVisibility: ReportingFormVisibility }>`
  position: absolute;
  top: 85px;
  right: ${p => (p.reportingFormVisibility === ReportingFormVisibility.VISIBLE ? '0' : '10')}px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`

// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
`
