import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setDisplayedItems, ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { addMission } from '../../../domain/use_cases/missions/addMission'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reportings/reduceReportingFormOnMap'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { isMissionOrMissionsPage } from '../../../utils/routes'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { sideWindowActions, SideWindowStatus } from '../../SideWindow/slice'

export function MissionsMenu() {
  const dispatch = useDispatch()
  const { displayMissionsLayer, isSearchMissionsVisible, reportingFormVisibility } = useAppSelector(
    state => state.global
  )
  const { sideWindow } = useAppSelector(state => state)

  const isMissionButtonIsActive = useMemo(
    () => isMissionOrMissionsPage(sideWindow.currentPath) && sideWindow.status !== SideWindowStatus.CLOSED,
    [sideWindow.currentPath, sideWindow.status]
  )

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
    dispatch(reduceReportingFormOnMap())
  }
  const handleAddNewMission = () => {
    dispatch(addMission())
  }

  return (
    <Wrapper
      reportingFormVisibility={
        reportingFormVisibility.context === ReportingContext.MAP
          ? reportingFormVisibility.visibility
          : VisibilityState.NONE
      }
    >
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
          <MenuWithCloseButton.Footer>
            <StyledButton Icon={Icon.Plus} isFullWidth onClick={handleAddNewMission}>
              Ajouter une nouvelle mission
            </StyledButton>
            <StyledSeparator />
            <StyledButton accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={toggleMissionsWindow}>
              Voir la vue détaillée des missions
            </StyledButton>
          </MenuWithCloseButton.Footer>
        </MenuWithCloseButton.Container>
      )}
      <MenuWithCloseButton.ButtonOnMap
        className={isMissionButtonIsActive ? '_active' : undefined}
        data-cy="missions-button"
        Icon={Icon.MissionAction}
        onClick={toggleMissionsMenu}
        size={Size.LARGE}
        title="voir les missions"
      />
    </Wrapper>
  )
}

const Wrapper = styled.div<{ reportingFormVisibility: VisibilityState }>`
  position: absolute;
  top: 82px;
  right: ${p => (p.reportingFormVisibility === VisibilityState.VISIBLE ? '0' : '10')}px;
  display: flex;
  justify-content: flex-end;
  transition: right 0.3s ease-out;
`

// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
`

const StyledSeparator = styled.div`
  height: 1px;
  border-top: 1px solid ${p => p.theme.color.gainsboro};
  margin-left: -12px;
  margin-right: -12px;
`
