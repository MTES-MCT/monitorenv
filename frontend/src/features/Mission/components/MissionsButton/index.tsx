import { DialogButton, StyledMapMenuDialogContainer } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { NumberOfFilters } from '@features/map/shared/style'
import { addMission } from '@features/Mission/useCases/addMission'
import { sideWindowActions, SideWindowStatus } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { isMissionOrMissionsPage } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { useMemo } from 'react'

import { INITIAL_STATE as initialFilters } from '../../../../domain/shared_slices/MissionFilters'
import { MissionFilterContext, MissionFilters } from '../Filters'

import type { MenuButtonProps } from '@components/Menu'

export function MissionsMenu({ onClickMenuButton, onVisibiltyChange }: MenuButtonProps) {
  const dispatch = useAppDispatch()

  const isSearchMissionsVisible = useAppSelector(state => state.global.visibility.isSearchMissionsVisible)
  const displayMissionsLayer = useAppSelector(state => state.global.layers.displayMissionsLayer)
  const sideWindow = useAppSelector(state => state.sideWindow)

  const {
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedPeriod,
    selectedSeaFronts,
    selectedStatuses,
    selectedTags,
    selectedThemes,
    selectedWithEnvActions
  } = useAppSelector(state => state.missionFilters)

  const {
    selectedAdministrationNames: initialAdministrationFilter,
    selectedCompletionStatus: initialCompletionStatusFilter,
    selectedControlUnitIds: initialControlUnitIdsFilter,
    selectedMissionTypes: initialMissionTypesFilter,
    selectedPeriod: initialPeriodFilter,
    selectedSeaFronts: initialSeaFrontFilter,
    selectedStatuses: initialStatusesFilter,
    selectedTags: initialTagsFilter,
    selectedThemes: initialThemesFilter,
    selectedWithEnvActions: initialWithEnvActionsFilter
  } = initialFilters

  const nbFilters =
    (selectedAdministrationNames?.length !== initialAdministrationFilter?.length ? 1 : 0) +
    (selectedCompletionStatus?.length !== initialCompletionStatusFilter?.length ? 1 : 0) +
    (selectedControlUnitIds?.length !== initialControlUnitIdsFilter?.length ? 1 : 0) +
    (selectedMissionTypes?.length !== initialMissionTypesFilter?.length ? 1 : 0) +
    (selectedPeriod?.length !== initialPeriodFilter?.length ? 1 : 0) +
    (selectedSeaFronts?.length !== initialSeaFrontFilter?.length ? 1 : 0) +
    (selectedStatuses?.length !== initialStatusesFilter?.length ? 1 : 0) +
    (selectedTags?.length !== initialTagsFilter?.length ? 1 : 0) +
    (selectedThemes?.length !== initialThemesFilter?.length ? 1 : 0) +
    (selectedWithEnvActions !== initialWithEnvActionsFilter ? 1 : 0)

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

      {nbFilters > 0 && <NumberOfFilters data-cy="mission-number-filters">{nbFilters}</NumberOfFilters>}
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
