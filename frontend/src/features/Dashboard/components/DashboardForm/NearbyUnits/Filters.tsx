import { CustomPeriodContainer } from '@components/style'
import {
  type NearbyUnit,
  NearbyUnitDateRangeEnum,
  NearbyUnitDateRangeLabels
} from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'
import { getSelectionState, handleSelection } from '@features/Dashboard/components/DashboardForm/ToggleSelectAll/utils'
import { dashboardActions, getActiveDashboardId } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { type DateAsStringRange, DateRangePicker, getOptionsFromLabelledEnum, Select } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions, getNearbyUnitFilters } from '../slice'
import { StyledToggleSelectAll } from '../ToggleSelectAll'

type FilterProps = {
  className?: string
  hasChildren?: boolean
  nearbyUnits: NearbyUnit[] | undefined
  selectedNearbyUnits: NearbyUnit[] | undefined
}

export function Filters({ className, hasChildren = false, nearbyUnits, selectedNearbyUnits }: FilterProps) {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))
  const nearbyUnitFilters = useAppSelector(state => getNearbyUnitFilters(state.dashboardFilters, activeDashboardId))

  const dateRangeOptions = getOptionsFromLabelledEnum(NearbyUnitDateRangeLabels)
  const updatePeriodFilter = (period: string | undefined) => {
    dispatch(
      dashboardFiltersActions.setNearbyUnitFilters({
        filters: { from: undefined, periodFilter: period, to: undefined },
        id: activeDashboardId
      })
    )
  }

  const updateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      dashboardFiltersActions.setNearbyUnitFilters({
        filters: { from: date?.[0] ?? undefined, to: date?.[1] ?? undefined },
        id: activeDashboardId
      })
    )
  }

  const selectionState = useMemo(
    () =>
      getSelectionState(
        selectedNearbyUnits?.map(nearbyUnit => nearbyUnit.controlUnit.id) ?? [],
        nearbyUnits?.map(nearbyUnit => nearbyUnit.controlUnit.id) ?? []
      ),
    [selectedNearbyUnits, nearbyUnits]
  )

  const handleRemoveAll = (itemIds: number[]) => {
    const selectedNearbyUnitsToRemove = selectedNearbyUnits?.filter(selectedNearbyUnit =>
      itemIds.includes(selectedNearbyUnit.controlUnit.id)
    )
    if (selectedNearbyUnitsToRemove) {
      dispatch(dashboardActions.removeNearbyUnitsFromSelection(selectedNearbyUnitsToRemove))
    }
  }

  const handleSelectAll = (itemIds: number[]) => {
    const nearbyUnitsToAdd = nearbyUnits?.filter(nearbyUnit => itemIds.includes(nearbyUnit.controlUnit.id))
    if (nearbyUnitsToAdd) {
      dispatch(dashboardActions.addNearbyUnitsToSelection(nearbyUnitsToAdd))
    }
  }

  return (
    <Container className={className}>
      <FirstLine>
        <Select
          cleanable={false}
          isLabelHidden
          isTransparent
          label="Période des unités proches"
          name="Période des unités proches"
          onChange={updatePeriodFilter}
          options={dateRangeOptions}
          placeholder="Unités proches depuis"
          style={{ width: '100%' }}
          value={nearbyUnitFilters?.periodFilter}
        />
        {(nearbyUnits?.length !== 0 || selectedNearbyUnits?.length !== 0) && (
          <FilterToggleSelectAll
            onSelection={() =>
              handleSelection({
                allIds: nearbyUnits?.map(nearbyUnit => nearbyUnit.controlUnit.id) ?? [],
                onRemove: ({ itemIds }) => handleRemoveAll(itemIds),
                onSelect: ({ itemIds }) => handleSelectAll(itemIds),
                selectedIds: selectedNearbyUnits?.map(nearbyUnit => nearbyUnit.controlUnit.id) ?? [],
                selectionState,
                type: Dashboard.Block.NEARBY_UNITS
              })
            }
            selectionState={selectionState}
          />
        )}
      </FirstLine>

      {nearbyUnitFilters?.periodFilter === NearbyUnitDateRangeEnum.CUSTOM && (
        <SecondLine $hasChildren={hasChildren}>
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              defaultValue={
                nearbyUnitFilters.from && nearbyUnitFilters.to
                  ? [new Date(nearbyUnitFilters.from), new Date(nearbyUnitFilters.to)]
                  : undefined
              }
              hasSingleCalendar
              isCompact
              isLabelHidden
              isStringDate
              label="Période spécifique des unités proches"
              name="nearbyUnitDateRange"
              onChange={updateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        </SecondLine>
      )}
    </Container>
  )
}

const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
  align-items: start;
  text-align: left;
`
const Container = styled.div`
  gap: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: start;
`
const FirstLine = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
`

const SecondLine = styled.div<{ $hasChildren: boolean }>``

const FilterToggleSelectAll = styled(StyledToggleSelectAll)`
  width: 100%;
`
