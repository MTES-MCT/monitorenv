import { CustomPeriodContainer } from '@components/style'
import { useGetFiltersOptions } from '@features/Dashboard/hooks/useGetFiltersOptions'
import { getActiveDashboardId } from '@features/Dashboard/slice'
import { RecentActivityFiltersEnum } from '@features/RecentActivity/slice'
import { RecentActivity } from '@features/RecentActivity/types'
import { OptionValue } from '@features/Reportings/Filters/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  CheckPicker,
  CustomSearch,
  type DateAsStringRange,
  DateRangePicker,
  Select,
  SingleTag
} from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions, getRecentActivityFilters, type RecentActivityFilters } from '../slice'

export function Filters() {
  const dispatch = useAppDispatch()

  const activeDashboardId = useAppSelector(state => getActiveDashboardId(state.dashboard))
  const recentActivityFilters = useAppSelector(state =>
    getRecentActivityFilters(state.dashboardFilters, activeDashboardId)
  )

  const filtersOptions = useGetFiltersOptions({ filters: {} })
  const { administrationsOptions, controlUnitsAsOptions, dateRangeOptions, isLoading, themesOptions } =
    filtersOptions.options
  const { administrations, controlUnits } = filtersOptions

  const controlUnitCustomSearch = useMemo(
    () => new CustomSearch(structuredClone(controlUnitsAsOptions ?? []), ['label'], { isStrict: true, threshold: 0.2 }),
    [controlUnitsAsOptions]
  )

  const themeCustomSearch = useMemo(
    () => new CustomSearch(structuredClone(themesOptions ?? []), ['label']),
    [themesOptions]
  )

  const updatePeriodFilter = period => {
    dispatch(
      dashboardFiltersActions.setRecentActivityFilters({
        filters: { periodFilter: period, startedAfter: undefined, startedBefore: undefined },
        id: activeDashboardId
      })
    )
  }

  const updateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      dashboardFiltersActions.setRecentActivityFilters({
        filters: { startedAfter: date?.[0] ?? undefined, startedBefore: date?.[1] ?? undefined },
        id: activeDashboardId
      })
    )
  }

  const setFilters = (
    newFilters: RecentActivityFilters[keyof RecentActivityFilters],
    key: RecentActivityFiltersEnum
  ) => {
    dispatch(
      dashboardFiltersActions.setRecentActivityFilters({
        filters: { [key]: newFilters },
        id: activeDashboardId
      })
    )
  }

  const onDeleteTag = (valueToDelete: number | string, filterKey: RecentActivityFiltersEnum) => {
    if (!Array.isArray(recentActivityFilters?.[filterKey])) {
      return
    }

    const nextSelectedValues = recentActivityFilters[filterKey].filter(selectedValue => selectedValue !== valueToDelete)

    dispatch(
      dashboardFiltersActions.setRecentActivityFilters({
        filters: { [filterKey]: nextSelectedValues.length === 0 ? undefined : nextSelectedValues },
        id: activeDashboardId
      })
    )
  }

  if (isLoading || !recentActivityFilters) {
    return null
  }

  return (
    <FiltersContainer>
      <DateFilterContainer>
        <Select
          cleanable={false}
          isLabelHidden
          isTransparent
          label="Période"
          name="Période"
          onChange={updatePeriodFilter}
          options={dateRangeOptions}
          placeholder="Date de signalement depuis"
          style={{ width: '100%' }}
          value={recentActivityFilters.periodFilter}
        />
        {recentActivityFilters.periodFilter === RecentActivity.RecentActivityDateRangeEnum.CUSTOM && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              defaultValue={
                recentActivityFilters.startedAfter && recentActivityFilters.startedBefore
                  ? [new Date(recentActivityFilters.startedAfter), new Date(recentActivityFilters.startedBefore)]
                  : undefined
              }
              hasSingleCalendar
              isCompact
              isLabelHidden
              isStringDate
              label="Période spécifique"
              name="recentActivityDateRange"
              onChange={updateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}
      </DateFilterContainer>
      <FilterLine>
        <ControlUnitsAndAdministrationsFilters>
          <CheckPicker
            isLabelHidden
            isTransparent
            label="Administration"
            name="administration"
            onChange={value => setFilters(value, RecentActivityFiltersEnum.ADMINISTRATION_IDS)}
            options={administrationsOptions}
            placeholder="Administration"
            renderValue={() =>
              recentActivityFilters.administrationIds && (
                <OptionValue>{`Administration (${recentActivityFilters.administrationIds.length})`}</OptionValue>
              )
            }
            searchable
            style={{ width: '50%' }}
            value={recentActivityFilters?.administrationIds}
          />

          <CheckPicker
            key={controlUnitsAsOptions?.length}
            customSearch={controlUnitCustomSearch}
            isLabelHidden
            isTransparent
            label="Unité"
            name="controlUnits"
            onChange={value => setFilters(value, RecentActivityFiltersEnum.CONTROL_UNIT_IDS)}
            options={controlUnitsAsOptions}
            placeholder="Unité"
            renderValue={() =>
              recentActivityFilters.controlUnitIds && (
                <OptionValue>{`Unité (${recentActivityFilters.controlUnitIds.length})`}</OptionValue>
              )
            }
            searchable
            style={{ width: '50%' }}
            value={recentActivityFilters.controlUnitIds}
          />
        </ControlUnitsAndAdministrationsFilters>
        <Tagscontainer>
          {recentActivityFilters.administrationIds &&
            recentActivityFilters.administrationIds?.length > 0 &&
            recentActivityFilters.administrationIds.map(adminId => (
              <SingleTag
                key={adminId}
                onDelete={() => onDeleteTag(adminId, RecentActivityFiltersEnum.ADMINISTRATION_IDS)}
              >
                {`Admin. ${administrations?.find(admin => admin.id === adminId)?.name}`}
              </SingleTag>
            ))}
          {recentActivityFilters.controlUnitIds &&
            recentActivityFilters.controlUnitIds?.length > 0 &&
            recentActivityFilters.controlUnitIds.map(controlUnitId => (
              <SingleTag
                key={controlUnitId}
                onDelete={() => onDeleteTag(controlUnitId, RecentActivityFiltersEnum.CONTROL_UNIT_IDS)}
              >
                {`Unité. ${controlUnits?.find(controlunit => controlunit.id === controlUnitId)?.name}`}
              </SingleTag>
            ))}
        </Tagscontainer>
      </FilterLine>
      <FilterLine>
        <CheckPicker
          key={themesOptions?.length}
          customSearch={themeCustomSearch}
          isLabelHidden
          isTransparent
          label="Thématique"
          name="theme"
          onChange={value => setFilters(value, RecentActivityFiltersEnum.THEME_IDS)}
          options={themesOptions}
          placeholder="Thématique"
          renderValue={() =>
            recentActivityFilters.themeIds && (
              <OptionValue>{`Thème (${recentActivityFilters.themeIds.length})`}</OptionValue>
            )
          }
          searchable
          value={recentActivityFilters.themeIds}
        />
        <Tagscontainer>
          {recentActivityFilters.themeIds &&
            recentActivityFilters.themeIds?.length > 0 &&
            recentActivityFilters.themeIds.map(themeId => (
              <SingleTag key={themeId} onDelete={() => onDeleteTag(themeId, RecentActivityFiltersEnum.THEME_IDS)}>
                {`Theme ${themesOptions?.find(theme => theme.value === themeId)?.label}`}
              </SingleTag>
            ))}
        </Tagscontainer>
      </FilterLine>
    </FiltersContainer>
  )
}

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px 24px;
`
const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
  align-items: start;
  text-align: left;
`
const DateFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FilterLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ControlUnitsAndAdministrationsFilters = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`
const Tagscontainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`
