import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setDisplayedItems } from '../../../domain/shared_slices/Global'
import { addMission } from '../../../domain/use_cases/missions/addMission'
import { reduceReportingFormOnMap } from '../../../domain/use_cases/reporting/reduceReportingFormOnMap'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { isMissionOrMissionsPage } from '../../../utils/routes'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'
import { ButtonWrapper } from '../../MainWindow/components/RightMenu/ButtonWrapper'
import { sideWindowActions, SideWindowStatus } from '../../SideWindow/slice'

export function MissionsMenu() {
  const dispatch = useAppDispatch()
  const isSearchMissionsVisible = useAppSelector(state => state.global.isSearchMissionsVisible)
  const displayMissionsLayer = useAppSelector(state => state.global.displayMissionsLayer)
  const sideWindow = useAppSelector(state => state.sideWindow)

  const isMissionButtonIsActive = useMemo(
    () => isMissionOrMissionsPage(sideWindow.currentPath) && sideWindow.status !== SideWindowStatus.CLOSED,
    [sideWindow.currentPath, sideWindow.status]
  )

  const toggleMissionsWindow = async () => {
    await dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  }

  const toggleMissionsLayer = () => {
    dispatch(setDisplayedItems({ displayMissionsLayer: !displayMissionsLayer }))
  }

  const toggleMissionsMenu = e => {
    e.preventDefault()
    dispatch(
      setDisplayedItems({
        isControlUnitDialogVisible: false,
        isControlUnitListDialogVisible: false,
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
    <ButtonWrapper topPosition={82}>
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
    </ButtonWrapper>
  )
}

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
