import { CustomSearch, Filter } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { ADMINISTRATION_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { useGetAdministrationsQuery } from '../../../api/administration'
import { NavButton } from '../../../ui/NavButton'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { Administration } from '../../../domain/entities/administration/types'

export function BackOfficeAdministrationList() {
  const [filters, setFilters] = useState<Array<Filter<Administration.Administration>>>([])

  const { data: administrations } = useGetAdministrationsQuery()

  const customSearch = useMemo(
    () =>
      administrations
        ? new CustomSearch(administrations, ['name'], {
            cacheKey: 'BACK_OFFICE_ADMINISTRATION_LIST',
            isStrict: true
          })
        : undefined,
    [administrations]
  )

  const filteredAdministrations = useMemo(
    () =>
      administrations
        ? filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), administrations)
        : undefined,
    [administrations, filters]
  )

  return (
    <>
      <Title>Administration des administrations</Title>

      <FilterBar customSearch={customSearch} onChange={setFilters} />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}/new`}>
          Nouvelle administration
        </NavButton>
      </ActionGroup>

      <DefaultTable columns={ADMINISTRATION_TABLE_COLUMNS} data={filteredAdministrations} />
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
