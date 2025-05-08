import { CustomPeriodContainer, CustomPeriodLabel } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { type DateAsStringRange, DateRangePicker, SingleTag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { dashboardFiltersActions } from '../../slice'

import type { DashboardType } from '@features/Dashboard/slice'
import type { TagOption } from 'domain/entities/tags'

type FiltersTagsProps = {
  dashboard: DashboardType
}

export function FiltersTags({ dashboard }: FiltersTagsProps) {
  const dispatch = useAppDispatch()

  const { id } = dashboard.dashboard

  const filters = useAppSelector(state => state.dashboardFilters.dashboards[id]?.filters)

  const setFilteredRegulatoryTags = (value: TagOption[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryTags: value }, id }))
  }

  const setFilteredAmpTypes = (value: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { amps: value }, id }))
  }

  const deleteRegulatoryTag = (regulatoryTagToDelete: TagOption) => {
    setFilteredRegulatoryTags(filters?.regulatoryTags?.filter(theme => theme.id !== regulatoryTagToDelete.id))
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
    (filters?.regulatoryTags && filters?.regulatoryTags.length > 0) ||
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
      {filters?.regulatoryTags?.map(tag => (
        <SingleTag key={tag.id} onDelete={() => deleteRegulatoryTag(tag)} title={tag.name}>
          {tag.name}
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
