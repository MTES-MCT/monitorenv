import { DialogButton, StyledMapMenuDialogContainer } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { SideWindowStatus, sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { isMissionOrMissionsPage } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { globalActions, setDisplayedItems } from 'domain/shared_slices/Global'
import { addMission } from 'domain/use_cases/missions/addMission'
import { reduceReportingFormOnMap } from 'domain/use_cases/reporting/reduceReportingFormOnMap'
import { useMemo } from 'react'

import { MissionFilterContext, MissionFilters } from '../components/Filters'

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
    dispatch(globalActions.hideSideButtons())
    dispatch(
      setDisplayedItems({
        isSearchMissionsVisible: !isSearchMissionsVisible
      })
    )
    dispatch(reduceReportingFormOnMap())
  }
  const handleAddNewMission = () => {
    dispatch(addMission())
  }

  return (
    <>
      {isSearchMissionsVisible && (
        <StyledMapMenuDialogContainer>
          <MapMenuDialog.Header>
            <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={toggleMissionsMenu} />
            <MapMenuDialog.Title>Missions et contrôles</MapMenuDialog.Title>
            <MapMenuDialog.VisibilityButton
              accent={Accent.SECONDARY}
              Icon={displayMissionsLayer ? Icon.Display : Icon.Hide}
              onClick={toggleMissionsLayer}
            />
          </MapMenuDialog.Header>
          <MapMenuDialog.Body>
            <MissionFilters context={MissionFilterContext.MAP} />
          </MapMenuDialog.Body>
          <MapMenuDialog.Footer>
            <DialogButton Icon={Icon.Plus} isFullWidth onClick={handleAddNewMission}>
              Ajouter une nouvelle mission
            </DialogButton>
            <DialogButton accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={toggleMissionsWindow}>
              Voir la vue détaillée des missions
            </DialogButton>
          </MapMenuDialog.Footer>
        </StyledMapMenuDialogContainer>
      )}
      <MenuWithCloseButton.ButtonOnMap
        className={isMissionButtonIsActive ? '_active' : undefined}
        data-cy="missions-button"
        Icon={Icon.MissionAction}
        onClick={toggleMissionsMenu}
        size={Size.LARGE}
        title="Voir les missions"
      />
    </>
  )
}
