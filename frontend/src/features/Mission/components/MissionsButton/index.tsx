import { DialogButton, StyledMapMenuDialogContainer } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { addMission } from '@features/Mission/useCases/addMission'
import { SideWindowStatus, sideWindowActions } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { isMissionOrMissionsPage } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { useMemo } from 'react'

import { MissionFilterContext, MissionFilters } from '../Filters'

import type { MenuButtonProps } from '@components/Menu'

export function MissionsMenu({ onClickMenuButton, onVisibiltyChange }: MenuButtonProps) {
  const dispatch = useAppDispatch()

  const isSearchMissionsVisible = useAppSelector(state => state.global.visibility.isSearchMissionsVisible)
  const displayMissionsLayer = useAppSelector(state => state.global.layers.displayMissionsLayer)
  const sideWindow = useAppSelector(state => state.sideWindow)

  const isMissionButtonIsActive = useMemo(
    () => isMissionOrMissionsPage(sideWindow.currentPath) && sideWindow.status !== SideWindowStatus.CLOSED,
    [sideWindow.currentPath, sideWindow.status]
  )

  const toggleMissionsWindow = async () => {
    await dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  }

  const toggleMissionsLayer = () => {
    onVisibiltyChange('displayMissionsLayer')
  }

  const toggleMissionsMenu = e => {
    e.preventDefault()
    onClickMenuButton()
    dispatch(
      setDisplayedItems({
        visibility: { isSearchMissionsVisible: !isSearchMissionsVisible }
      })
    )
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
