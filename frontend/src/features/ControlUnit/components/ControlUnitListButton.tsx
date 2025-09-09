import { INITIAL_STATE as initialFilters } from '@features/ControlUnit/components/ControlUnitListDialog/slice'
import { NumberOfFilters } from '@features/map/shared/style'
import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'
import { Icon, Size } from '@mtes-mct/monitor-ui'

import { ControlUnitListDialog } from './ControlUnitListDialog'
import { globalActions } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { MenuWithCloseButton } from '../../commonStyles/map/MenuWithCloseButton'

import type { MenuButtonProps } from '@components/Menu'

export function ControlUnitListButton({ onClickMenuButton, onVisibiltyChange }: MenuButtonProps) {
  const dispatch = useAppDispatch()
  const isControlUnitListDialogVisible = useAppSelector(state => state.global.visibility.isControlUnitListDialogVisible)

  const {
    administrationId: initialAdministrationFilter,
    categories: initialCategoriesFilter,
    stationId: initialStationIdFilter,
    type: initialTypeFilter
  } = initialFilters.filtersState
  const { administrationId, categories, stationId, type } = useAppSelector(
    store => store.mapControlUnitListDialog.filtersState
  )

  const nbFilters =
    (administrationId !== initialAdministrationFilter ? 1 : 0) +
    (categories?.length !== initialCategoriesFilter?.length ? 1 : 0) +
    (stationId !== initialStationIdFilter ? 1 : 0) +
    (type !== initialTypeFilter ? 1 : 0)

  const toggleDialog = () => {
    onClickMenuButton()
    dispatch(
      globalActions.setDisplayedItems({
        visibility: { isControlUnitListDialogVisible: !isControlUnitListDialogVisible }
      })
    )
    dispatch(missionFormsActions.setMissionCenteredControlUnitId())
  }

  return (
    <>
      {/* TODO The right menu should be a full `MainWindow` feature component by itself. */}
      {/* We should positition related dialogs independantly, not include them here. */}
      {isControlUnitListDialogVisible && (
        <ControlUnitListDialog onClose={toggleDialog} onVisibiltyChange={onVisibiltyChange} />
      )}

      {nbFilters > 0 && <NumberOfFilters data-cy="control-unit-number-filters">{nbFilters}</NumberOfFilters>}
      <MenuWithCloseButton.ButtonOnMap
        $isActive={isControlUnitListDialogVisible}
        Icon={Icon.ControlUnit}
        onClick={toggleDialog}
        size={Size.LARGE}
        title="Liste des unités de contrôle"
      />
    </>
  )
}
