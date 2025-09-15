import { vigilanceAreaFiltersActions } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { type DateAsStringRange, DateRangePicker } from '@mtes-mct/monitor-ui'

export function SpecificPeriodFilter() {
  const dispatch = useAppDispatch()

  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.vigilanceAreaFilters.specificPeriod)

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'specificPeriod', value: dateRange }))
  }

  return (
    <DateRangePicker
      defaultValue={vigilanceAreaSpecificPeriodFilter as DateAsStringRange}
      isLabelHidden
      isStringDate
      label="Période spécifique"
      name="dateRange"
      onChange={updateDateRangeFilter}
    />
  )
}
