import { DataTable } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { FilterBar } from './FilterBar'
import { TabMenu } from './TabMenu'
import { getAdministrationTableColumns, getFilters } from './utils'
import { useGetAdministrationsQuery } from '../../../../api/administrationsAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { NavButton } from '../../../../ui/NavButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOfficeMenu/constants'

export function AdministrationTable() {
  const backOfficeAdministrationList = useAppSelector(store => store.backOfficeAdministrationList)
  const dispatch = useAppDispatch()
  const { data: administrations } = useGetAdministrationsQuery()

  const administrationTableColumns = useMemo(
    () => getAdministrationTableColumns(dispatch, backOfficeAdministrationList.filtersState.isArchived),
    [backOfficeAdministrationList.filtersState.isArchived, dispatch]
  )

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

      <TabMenu />

      <FilterBar />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}/new`}>
          Nouvelle administration
        </NavButton>
      </ActionGroup>

      <DataTable
        columns={administrationTableColumns}
        data={filteredAdministrations}
        initialSorting={[{ desc: false, id: 'name' }]}
      />
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
