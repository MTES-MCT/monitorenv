import { CustomPeriodContainer, CustomPeriodLabel } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { DateRangePicker, SingleTag, type DateAsStringRange } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { dashboardFiltersActions } from '../../slice'

import type { DashboardType } from '@features/Dashboard/slice'

type FiltersTagsProps = {
  dashboard: DashboardType
}

export function FiltersTags({ dashboard }: FiltersTagsProps) {
  const dispatch = useAppDispatch()

  const { id } = dashboard.dashboard

  const filters = useAppSelector(state => state.dashboardFilters.dashboards[id]?.filters)

  const setFilteredRegulatoryThemes = (value: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryThemes: value }, id }))
  }

  const setFilteredAmpTypes = (value: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { amps: value }, id }))
  }

  const deleteRegulatoryTheme = (regulatoryThemeToDelete: string) => {
    setFilteredRegulatoryThemes(filters?.regulatoryThemes?.filter(theme => theme !== regulatoryThemeToDelete))
  }

  const deleteAmpType = (ampTypeToDelete: string) => {
    setFilteredAmpTypes(filters?.amps?.filter(type => type !== ampTypeToDelete))
  }

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { specificPeriod: dateRange }, id }))
  }

  const resetFilters = () => {
    dispatch(dashboardFiltersActions.resetDashboardFilters({ id }))
  }

  const hasFilters = !!(
    (filters?.regulatoryThemes && filters?.regulatoryThemes.length > 0) ||
    (filters?.amps && filters?.amps.length > 0) ||
    filters?.vigilanceAreaPeriod
  )
  if (!hasFilters && filters?.vigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD) {
    return null
  }

  return (
    <TagsContainer data-cy="dashboard-filter-tags">
      {filters?.vigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD && (
        <CustomPeriodContainer>
          <CustomPeriodLabel>Période spécifique</CustomPeriodLabel>
          <DateRangePicker
            key="dateRange"
            defaultValue={filters?.specificPeriod ?? undefined}
            isLabelHidden
            isStringDate
            label="Période spécifique"
            name="dateRange"
            onChange={updateDateRangeFilter}
          />
        </CustomPeriodContainer>
      )}
      {filters?.regulatoryThemes?.map(theme => (
        <SingleTag key={theme} onDelete={() => deleteRegulatoryTheme(theme)} title={theme}>
          {theme}
        </SingleTag>
      ))}

      {filters?.amps?.map(type => (
        <SingleTag key={type} onDelete={() => deleteAmpType(type)} title={type}>
          {type}
        </SingleTag>
      ))}

      <ReinitializeFiltersButton onClick={resetFilters} />
    </TagsContainer>
  )
}

const TagsContainer = styled.div`
  align-items: end;
  display: flex;
  gap: 16px;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100%;
`
