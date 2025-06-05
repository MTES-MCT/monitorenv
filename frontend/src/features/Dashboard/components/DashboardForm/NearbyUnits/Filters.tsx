import { CustomPeriodContainer } from '@components/style'
import { getActiveDashboardId } from '@features/Dashboard/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { type DateAsStringRange, DateRangePicker, getOptionsFromLabelledEnum, Select } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { dashboardFiltersActions, getNearbyUnitFilters } from '../slice'

export enum NearbyUnitDateRangeEnum {
  CUSTOM = 'CUSTOM',
  FOURTEEN_LAST_DAYS = 'FOURTEEN_LAST_DAYS',
  SEVEN_LAST_DAYS = 'SEVEN_LAST_DAYS',
  SEVEN_NEXT_DAYS = 'SEVEN_NEXT_DAYS',
  TODAY = 'TODAY'
}

/* eslint-disable typescript-sort-keys/string-enum */
export enum NearbyUnitDateRangeLabels {
  TODAY = "Aujourd'hui",
  FOURTEEN_LAST_DAYS = '14 derniers jours',
  SEVEN_LAST_DAYS = '7 derniers jours',
  SEVEN_NEXT_DAYS = '7 prochains jours',
  CUSTOM = 'Période spécifique'
}

export function Filters() {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))
  const nearbyUnitFilters = useAppSelector(state => getNearbyUnitFilters(state.dashboardFilters, activeDashboardId))

  const dateRangeOptions = getOptionsFromLabelledEnum(NearbyUnitDateRangeLabels)
  const updatePeriodFilter = period => {
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

  if (!nearbyUnitFilters) {
    return null
  }

  return (
    <Container>
      <Select
        cleanable={false}
        isLabelHidden
        isTransparent
        label="Période"
        name="Période"
        onChange={updatePeriodFilter}
        options={dateRangeOptions}
        placeholder="Unités proches depuis"
        value={nearbyUnitFilters.periodFilter}
      />
      {nearbyUnitFilters.periodFilter === NearbyUnitDateRangeEnum.CUSTOM && (
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
      )}
    </Container>
  )
}

const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
  align-items: start;
  text-align: left;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: start;
  width: 100%;
`
