import { CustomSearch, Filter } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { PORT_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { useGetPortsQuery } from '../../../api/port'
import { NavButton } from '../../../ui/NavButton'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { Port } from '../../../domain/entities/port/types'

export function BackOfficePortList() {
  const [filters, setFilters] = useState<Array<Filter<Port.Port>>>([])

  const { data: ports } = useGetPortsQuery()

  const customSearch = useMemo(
    () =>
      ports
        ? new CustomSearch(ports, ['name'], {
            cacheKey: 'BACK_OFFICE_PORT_ADMINISTRATION_LIST',
            isStrict: true
          })
        : undefined,
    [ports]
  )

  const filteredPorts = useMemo(
    () => (ports ? filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), ports) : undefined),
    [ports, filters]
  )

  return (
    <>
      <Title>Administration des ports</Title>

      <FilterBar customSearch={customSearch} onChange={setFilters} />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.PORT_LIST]}/new`}>Nouveau port</NavButton>
      </ActionGroup>

      <DefaultTable columns={PORT_TABLE_COLUMNS} data={filteredPorts} />
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
