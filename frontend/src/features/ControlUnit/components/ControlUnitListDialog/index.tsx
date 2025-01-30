import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { StyledMapMenuDialogContainer } from '@components/style'
import { getFilteredControlUnits } from '@features/ControlUnit/useCases/getFilteredControlUnits'
import { Accent, Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { useCallback, useMemo } from 'react'

import { FilterBar } from './FilterBar'
import { Item } from './Item'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { stationActions } from '../../../Station/slice'

import type { Promisable } from 'type-fest'

type ControlUnitListDialogProps = {
  onClose: () => Promisable<void>
}
export function ControlUnitListDialog({ onClose }: ControlUnitListDialogProps) {
  const dispatch = useAppDispatch()
  const displayBaseLayer = useAppSelector(store => store.global.layers.displayStationLayer)
  const mapControlUnitListDialog = useAppSelector(store => store.mapControlUnitListDialog)
  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const filteredControlUnits = useMemo(() => {
    if (!mapControlUnitListDialog.filtersState) {
      return []
    }

    const results = getFilteredControlUnits(
      'MAP_CONTROL_UNIT_LIST',
      mapControlUnitListDialog.filtersState,
      controlUnits
    )

    return results
  }, [mapControlUnitListDialog.filtersState, controlUnits])

  const toggleBaseLayer = useCallback(() => {
    dispatch(stationActions.hightlightFeatureIds([]))
    dispatch(stationActions.selectFeatureId(undefined))
    dispatch(
      globalActions.setDisplayedItems({
        layers: { displayStationLayer: !displayBaseLayer }
      })
    )
  }, [dispatch, displayBaseLayer])

  return (
    <StyledMapMenuDialogContainer style={{ height: 480 }}>
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={onClose} />
        <MapMenuDialog.Title>Unités de contrôle</MapMenuDialog.Title>
        <MapMenuDialog.VisibilityButton
          accent={Accent.SECONDARY}
          Icon={displayBaseLayer ? Icon.Display : Icon.Hide}
          onClick={toggleBaseLayer}
          title={displayBaseLayer ? 'Masquer les bases' : 'Afficher les bases'}
        />
      </MapMenuDialog.Header>
      <MapMenuDialog.Body>
        <FilterBar />

        {filteredControlUnits &&
          filteredControlUnits.map(controlUnit => <Item key={controlUnit.id} controlUnit={controlUnit} />)}
      </MapMenuDialog.Body>
    </StyledMapMenuDialogContainer>
  )
}
