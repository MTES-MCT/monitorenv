import { Accent, Button, Icon, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { noop } from 'lodash/fp'
import { useMemo } from 'react'

import { FilterBar } from './FilterBar'
import { Item } from './Item'
import { getFilters } from './utils'
import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { Promisable } from 'type-fest'

export type MapControlUnitListDialogProps = {
  onClose: () => Promisable<void>
}
export function MapControlUnitListDialog({ onClose }: MapControlUnitListDialogProps) {
  const mapControlUnitListDialog = useAppSelector(store => store.mapControlUnitListDialog)
  const { data: controlUnits } = useGetControlUnitsQuery()

  const filteredControlUnits = useMemo(() => {
    if (!controlUnits) {
      return undefined
    }

    const filters = getFilters(controlUnits, mapControlUnitListDialog.filtersState)

    return filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnits)
  }, [controlUnits, mapControlUnitListDialog.filtersState])

  return (
    <MapMenuDialog.Container style={{ height: 480 }}>
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={onClose} />
        <MapMenuDialog.Title>Unités de contrôle</MapMenuDialog.Title>
        <MapMenuDialog.VisibilityButton accent={Accent.SECONDARY} Icon={Icon.Display} />
      </MapMenuDialog.Header>
      <MapMenuDialog.Body>
        <FilterBar />

        {filteredControlUnits &&
          filteredControlUnits.map(controlUnit => <Item key={controlUnit.id} controlUnit={controlUnit} />)}
      </MapMenuDialog.Body>
      <MapMenuDialog.Footer>
        <Button accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={noop}>
          Voir la vue détaillée des unités
        </Button>
      </MapMenuDialog.Footer>
    </MapMenuDialog.Container>
  )
}
