import { useMemo } from 'react'
import styled from 'styled-components'

import { ADMINISTRATION_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { getFilters } from './utils'
import { useGetAdministrationsQuery } from '../../../api/administrationsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { NavButton } from '../../../ui/NavButton'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

export function BackOfficeAdministrationList() {
  const backOfficeAdministrationList = useAppSelector(store => store.backOfficeAdministrationList)
  const { data: administrations } = useGetAdministrationsQuery()

  const filteredAdministrations = useMemo(() => {
    if (!administrations) {
      return undefined
    }

    const filters = getFilters(administrations, backOfficeAdministrationList.filtersState)

    return filters.reduce((previousAdministrations, filter) => filter(previousAdministrations), administrations)
  }, [backOfficeAdministrationList.filtersState, administrations])

  return (
    <>
      <Title>Administration des administrations</Title>

      <FilterBar />

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
