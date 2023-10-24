import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setDisplayedItems, ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import { addMission } from '../../../domain/use_cases/missions/addMission'
import { saveMissionInLocalStore } from '../../../domain/use_cases/missions/saveMissionInLocalStore'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { isMissionOrMissionsPage } from '../../../utils/routes'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { sideWindowActions, SideWindowStatus } from '../../SideWindow/slice'

export function MissionsMenu() {
  const dispatch = useAppDispatch()
  const global = useAppSelector(state => state.global)
  const mainWindow = useAppSelector(state => state.mainWindow)
  const { sideWindow } = useAppSelector(state => state)

  const isMissionButtonIsActive = useMemo(
    () => isMissionOrMissionsPage(sideWindow.currentPath) && sideWindow.status !== SideWindowStatus.CLOSED,
    [sideWindow.currentPath, sideWindow.status]
  )

  const toggleMissionsWindow = async () => {
    await dispatch(saveMissionInLocalStore())
    await dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  }

  const toggleMissionsLayer = () => {
    dispatch(setDisplayedItems({ displayMissionsLayer: !global.displayMissionsLayer }))
  }

  const toggleMissionsMenu = e => {
    e.preventDefault()
    dispatch(
      setDisplayedItems({
        isControlUnitDialogVisible: false,
        isControlUnitListDialogVisible: false,
        isSearchMissionsVisible: !global.isSearchMissionsVisible,
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
      $isShrinked={
        mainWindow.isSideDialogOpen ||
        (global.reportingFormVisibility.context === ReportingContext.MAP &&
          global.reportingFormVisibility.visibility !== VisibilityState.NONE)
      }
    >
      {global.isSearchMissionsVisible && (
        <MenuWithCloseButton.Container>
          <MenuWithCloseButton.Header>
            <MenuWithCloseButton.CloseButton Icon={Icon.Close} onClick={toggleMissionsMenu} />
            <MenuWithCloseButton.Title>Missions et contrôles</MenuWithCloseButton.Title>
            <MenuWithCloseButton.VisibilityButton
              accent={Accent.SECONDARY}
              Icon={global.displayMissionsLayer ? Icon.Display : Icon.Hide}
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

const Wrapper = styled.div<{
  $isShrinked: boolean
}>`
  position: absolute;
  top: 82px;
  right: ${p => (p.$isShrinked ? 0 : '10px')};
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
