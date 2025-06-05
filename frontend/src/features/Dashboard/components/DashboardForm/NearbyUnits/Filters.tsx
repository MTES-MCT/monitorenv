import { CustomPeriodContainer } from '@components/style'
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

import type { NearbyUnit } from '@api/nearbyUnitsAPI'

export enum NearbyUnitDateRangeEnum {
  CUSTOM = 'CUSTOM',
  FOURTEEN_LAST_DAYS = 'FOURTEEN_LAST_DAYS',
  SEVEN_LAST_DAYS = 'SEVEN_LAST_DAYS',
  SEVEN_NEXT_DAYS = 'SEVEN_NEXT_DAYS',
  TODAY = 'TODAY'
}

/* eslint-disable typescript-sort-keys/string-enum */
export enum NearbyUnitDateRangeLabels {
  SEVEN_LAST_DAYS = '7 derniers jours',
  TODAY = "Aujourd'hui",
  FOURTEEN_LAST_DAYS = '14 derniers jours',
  SEVEN_NEXT_DAYS = '7 prochains jours',
  CUSTOM = 'Période spécifique'
}

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
        filters: { periodFilter: period, startedAfter: undefined, startedBefore: undefined },
        id: activeDashboardId
      })
    )
  }

  const updateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      dashboardFiltersActions.setNearbyUnitFilters({
        filters: { startedAfter: date?.[0] ?? undefined, startedBefore: date?.[1] ?? undefined },
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

  return (
    <Container
      $hasChildren={hasChildren}
      $hasPeriodFilter={nearbyUnitFilters?.periodFilter === NearbyUnitDateRangeEnum.CUSTOM}
      className={className}
    >
      <FirstLine
        $hasChildren={hasChildren}
        $hasPeriodFilter={nearbyUnitFilters?.periodFilter === NearbyUnitDateRangeEnum.CUSTOM}
      >
        <Select
          cleanable={false}
          isLabelHidden
          isTransparent
          label="Période"
          name="Période"
          onChange={updatePeriodFilter}
          options={dateRangeOptions}
          placeholder="Unités proches depuis"
          style={{ width: '100%' }}
          value={nearbyUnitFilters?.periodFilter ?? NearbyUnitDateRangeEnum.SEVEN_NEXT_DAYS}
        />
        {(nearbyUnits?.length !== 0 || selectedNearbyUnits?.length !== 0) && (
          <FilterToggleSelectAll
            onSelection={() =>
              handleSelection({
                allIds: nearbyUnits?.map(nearbyUnit => nearbyUnit.controlUnit.id) ?? [],
                onRemove: ({ itemIds }) => {
                  const selectedNearbyUnitsToRemove = selectedNearbyUnits?.filter(selectedNearbyUnit =>
                    itemIds.includes(selectedNearbyUnit.controlUnit.id)
                  )
                  if (selectedNearbyUnitsToRemove) {
                    dispatch(dashboardActions.removeNearbyUnitsFromSelection(selectedNearbyUnitsToRemove))
                  }
                },
                onSelect: ({ itemIds }) => {
                  const nearbyUnitsToAdd = nearbyUnits?.filter(nearbyUnit =>
                    itemIds.includes(nearbyUnit.controlUnit.id)
                  )
                  if (nearbyUnitsToAdd) {
                    dispatch(dashboardActions.addNearbyUnitsToSelection(nearbyUnitsToAdd))
                  }
                },
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
                nearbyUnitFilters.startedAfter && nearbyUnitFilters.startedBefore
                  ? [new Date(nearbyUnitFilters.startedAfter), new Date(nearbyUnitFilters.startedBefore)]
                  : undefined
              }
              hasSingleCalendar
              isCompact
              isLabelHidden
              isStringDate
              label="Période spécifique"
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
const Container = styled.div<{ $hasChildren: boolean; $hasPeriodFilter: boolean }>`
  gap: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: start;
`
const FirstLine = styled.div<{ $hasChildren: boolean; $hasPeriodFilter: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
`

const SecondLine = styled.div<{ $hasChildren: boolean }>``

const FilterToggleSelectAll = styled(StyledToggleSelectAll)`
  width: 100%;
`
