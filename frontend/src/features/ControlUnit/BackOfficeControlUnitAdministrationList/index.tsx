import { CustomSearch, Filter } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { CONTROL_UNIT_ADMINISTRATION_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { useGetControlUnitAdministrationsQuery } from '../../../api/controlUnitAdministration'
import { NavButton } from '../../../ui/NavButton'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { ControlUnit } from '../../../domain/entities/controlUnit/types'

export function BackOfficeControlUnitAdministrationList() {
  const [filters, setFilters] = useState<Array<Filter<ControlUnit.ControlUnitAdministration>>>([])

  const { data: controlUnitAdministrations } = useGetControlUnitAdministrationsQuery()

  const customSearch = useMemo(
    () =>
      controlUnitAdministrations
        ? new CustomSearch(controlUnitAdministrations, ['name'], {
            cacheKey: 'BACK_OFFICE_CONTROL_UNIT_ADMINISTRATION_LIST',
            isStrict: true
          })
        : undefined,
    [controlUnitAdministrations]
  )

  const filteredControlUnitAdministrations = useMemo(
    () =>
      controlUnitAdministrations
        ? filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnitAdministrations)
        : undefined,
    [controlUnitAdministrations, filters]
  )

  return (
    <>
      <Title>Administration des administrations</Title>

      <FilterBar customSearch={customSearch} onChange={setFilters} />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_ADMINISTRATION_LIST]}/new`}>
          Nouvelle administration
        </NavButton>
      </ActionGroup>

      <DefaultTable columns={CONTROL_UNIT_ADMINISTRATION_TABLE_COLUMNS} data={filteredControlUnitAdministrations} />
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
