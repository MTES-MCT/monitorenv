import { ExpandedRowLabel, ExpandedRowList, ExpandedRowValue } from '@components/Table/TableWithSelectableRows/style'
import { getIconFromControlUnitResourceType } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitResourceList/utils'
import { THEME } from '@mtes-mct/monitor-ui'
import { type LegacyControlUnit } from 'domain/entities/legacyControlUnit'
import styled from 'styled-components'

export function UnitCell({ controlUnits }: { controlUnits: LegacyControlUnit[] }) {
  return (
    <ExpandedRowList>
      {controlUnits.map(unit => (
        <li key={unit.id}>
          <ExpandedRowLabel>{unit.administration}</ExpandedRowLabel>
          <ExpandedRowValue>{unit.name}</ExpandedRowValue>
          {unit.resources.map(resource => {
            const Icon = getIconFromControlUnitResourceType(resource.type)

            return (
              <ExpandedRowValue key={resource.id}>
                <HAlign>
                  {Icon ? <Icon color={THEME.color.slateGray} size={16} /> : undefined} {resource.name}
                </HAlign>
              </ExpandedRowValue>
            )
          })}
        </li>
      ))}
    </ExpandedRowList>
  )
}

const HAlign = styled.div`
  display: flex;
  align-items: center;
`
