import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { noop } from 'lodash/fp'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { FilterBar } from './FilterBar'
import { displayControlUnitResourcesFromControlUnit, displayPortNamesFromControlUnit } from './utils'
import { useGetControlUnitsQuery } from '../../../api/controlUnit'
import { MapMenuDialog } from '../../../ui/MapMenuDialog'

import type { Filter } from './types'
import type { Promisable } from 'type-fest'

export type ControlUnitListDialogProps = {
  onClose: () => Promisable<void>
}
export function ControlUnitListDialog({ onClose }: ControlUnitListDialogProps) {
  const [filters, setFilters] = useState<Filter[]>([])

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
          filteredControlUnits.map(controlUnit => (
            <Item>
              <NameText>{controlUnit.name}</NameText>
              <AdministrationText>{controlUnit.controlUnitAdministration.name}</AdministrationText>
              <ResourcesAndPortsText>{displayControlUnitResourcesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
              <ResourcesAndPortsText>{displayPortNamesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
            </Item>
          ))}
      </MapMenuDialog.Body>
      <MapMenuDialog.Footer>
        <Button accent={Accent.SECONDARY} Icon={Icon.Expand} isFullWidth onClick={noop}>
          Voir la vue détaillée des unités
        </Button>
      </MapMenuDialog.Footer>
    </MapMenuDialog.Container>
  )
}

const Item = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  margin-top: 8px;
  padding: 8px 12px;
  /* TODO Check monitor-ui <MapMenuDialog.Body /> alignment. */
  text-align: left;
`

const NameText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  line-height: 18px;
`

const AdministrationText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  line-height: 18px;
  margin: 2px 0 8px;
`

const ResourcesAndPortsText = styled.div`
  color: ${p => p.theme.color.slateGray};
  line-height: 18px;
`
