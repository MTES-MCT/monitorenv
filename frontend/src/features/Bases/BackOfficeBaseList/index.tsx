import { CustomSearch, Filter } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { BASE_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { useGetBasesQuery } from '../../../api/basesAPI'
import { NavButton } from '../../../ui/NavButton'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { Base } from '../../../domain/entities/base'

export function BackOfficeBaseList() {
  const [filters, setFilters] = useState<Array<Filter<Base.Base>>>([])

  const { data: bases } = useGetBasesQuery()

  const customSearch = useMemo(
    () =>
      bases
        ? new CustomSearch(bases, ['name'], {
            cacheKey: 'BACK_OFFICE_BASE_ADMINISTRATION_LIST',
            isStrict: true
          })
        : undefined,
    [bases]
  )

  const filteredBases = useMemo(
    () => (bases ? filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), bases) : undefined),
    [bases, filters]
  )

  return (
    <>
      <Title>Administration des bases</Title>

      <FilterBar customSearch={customSearch} onChange={setFilters} />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}/new`}>Nouvelle base</NavButton>
      </ActionGroup>

      <DefaultTable columns={BASE_TABLE_COLUMNS} data={filteredBases} />
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
