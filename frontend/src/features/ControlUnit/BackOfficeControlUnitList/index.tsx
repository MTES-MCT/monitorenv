import { CustomSearch, Filter } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { CONTROL_UNIT_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { useGetControlUnitsQuery } from '../../../api/controlUnit'
import { NavButton } from '../../../ui/NavButton'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { ControlUnit } from '../../../domain/entities/controlUnit/types'

export function BackOfficeControlUnitList() {
  const [filters, setFilters] = useState<Array<Filter<ControlUnit.ControlUnit>>>([])

  const { data: controlUnits } = useGetControlUnitsQuery()

  const customSearch = useMemo(
    () =>
      controlUnits
        ? new CustomSearch(controlUnits, ['controlUnitAdministration.name', 'name'], {
            cacheKey: 'BACK_OFFICE_CONTROL_UNIT_ADMINISTRATION_LIST',
            isStrict: true
          })
        : undefined,
    [controlUnits]
  )

  const filteredControlUnits = useMemo(
    () =>
      controlUnits
        ? filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnits)
        : undefined,
    [controlUnits, filters]
  )

  return (
    <>
      <Title>Administration des unités de contrôle</Title>

      <FilterBar customSearch={customSearch} onChange={setFilters} />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/new`}>
          Nouvelle unité de contrôle
        </NavButton>
      </ActionGroup>

      <DefaultTable columns={CONTROL_UNIT_TABLE_COLUMNS} data={filteredControlUnits} />
    </>
  )
}

const Title = styled.h1`
  line-height: 1;
  font-size: 24px;
  margin: 0 0 24px;
`

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`
