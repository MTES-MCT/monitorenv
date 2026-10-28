import { ExpandedRowLabel, ExpandedRowList, ExpandedRowValue } from '@components/Table/TableWithSelectableRows/style'
import { getIconFromControlUnitResourceType } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitResourceList/utils'
import { THEME } from '@mtes-mct/monitor-ui'
import { type LegacyControlUnit } from 'domain/entities/legacyControlUnit'
import { Fragment } from 'react'
import styled from 'styled-components'

export function UnitCell({ controlUnits }: { controlUnits: LegacyControlUnit[] }) {
  const groupedControlUnits = controlUnits.reduce(
    (acc, unit) => {
      if (!acc[unit.administration]) {
        acc[unit.administration] = []
      }
      acc[unit.administration]?.push(unit)

      return acc
    },
    {} as Record<string, LegacyControlUnit[]>
  )

  return (
    <ExpandedRowList>
      {Object.entries(groupedControlUnits).map(([administration, units]) => (
        <li key={administration}>
          <ExpandedRowLabel>{administration}</ExpandedRowLabel>
          {units.map(unit => (
            <Fragment key={unit.id}>
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
            </Fragment>
          ))}
        </li>
      ))}
    </ExpandedRowList>
  )
}

const HAlign = styled.div`
  display: flex;
  align-items: center;
`
