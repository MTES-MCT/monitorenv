import { Accent, Button, Filter, Icon } from '@mtes-mct/monitor-ui'
import { noop } from 'lodash/fp'
import { useMemo, useState } from 'react'

import { FilterBar } from './FilterBar'
import { Item } from './Item'
import { useGetControlUnitsQuery } from '../../../api/controlUnit'
import { MapMenuDialog } from '../../../ui/MapMenuDialog'

import type { ControlUnit } from '../../../domain/entities/controlUnit/types'
import type { Promisable } from 'type-fest'

export type ControlUnitListDialogProps = {
  onClose: () => Promisable<void>
}
export function ControlUnitListDialog({ onClose }: ControlUnitListDialogProps) {
  const [filters, setFilters] = useState<Array<Filter<ControlUnit.ControlUnit>>>([])

  const { data: controlUnits } = useGetControlUnitsQuery()

  const filteredControlUnits = useMemo(
    () =>
      controlUnits
        ? filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnits)
        : undefined,
    [controlUnits, filters]
  )

  return (
    <MapMenuDialog.Container style={{ height: 480 }}>
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={onClose} />
        <MapMenuDialog.Title>Unités de contrôle</MapMenuDialog.Title>
        <MapMenuDialog.VisibilityButton accent={Accent.SECONDARY} Icon={Icon.Display} />
      </MapMenuDialog.Header>
      <MapMenuDialog.Body>
        <FilterBar onChange={setFilters} />

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
