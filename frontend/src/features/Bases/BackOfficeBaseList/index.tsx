import { DataTable } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { BASE_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { getFilters } from './utils'
import { useGetBasesQuery } from '../../../api/basesAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { NavButton } from '../../../ui/NavButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

export function BackOfficeBaseList() {
  const backOfficeBaseList = useAppSelector(store => store.backOfficeBaseList)
  const { data: bases } = useGetBasesQuery()

  const filteredBases = useMemo(() => {
    if (!bases) {
      return undefined
    }

    const filters = getFilters(bases, backOfficeBaseList.filtersState)

    return filters.reduce((previousBases, filter) => filter(previousBases), bases)
  }, [backOfficeBaseList.filtersState, bases])

  return (
    <>
      <Title>Administration des bases</Title>

      <FilterBar />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}/new`}>Nouvelle base</NavButton>
      </ActionGroup>

      <DataTable columns={BASE_TABLE_COLUMNS} data={filteredBases} initialSorting={[{ desc: false, id: 'name' }]} />
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
