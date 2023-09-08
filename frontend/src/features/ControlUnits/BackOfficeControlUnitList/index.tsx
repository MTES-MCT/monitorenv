import { DataTable } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { CONTROL_UNIT_TABLE_COLUMNS } from './constants'
import { FilterBar } from './FilterBar'
import { getFilters } from './utils'
import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { NavButton } from '../../../ui/NavButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

export function BackOfficeControlUnitList() {
  const backOfficeControlUnitList = useAppSelector(store => store.backOfficeControlUnitList)
  const { data: controlUnits } = useGetControlUnitsQuery()

  const filteredControlUnits = useMemo(() => {
    if (!controlUnits) {
      return undefined
    }

    const filters = getFilters(controlUnits, backOfficeControlUnitList.filtersState)

    return filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnits)
  }, [controlUnits, backOfficeControlUnitList.filtersState])

  return (
    <>
      <Title>Administration des unités de contrôle</Title>

      <FilterBar />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/new`}>
          Nouvelle unité de contrôle
        </NavButton>
      </ActionGroup>

      <DataTable
        columns={CONTROL_UNIT_TABLE_COLUMNS}
        data={filteredControlUnits}
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
