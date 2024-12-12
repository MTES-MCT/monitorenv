import { useGetControlPlansByYear } from '@hooks/useGetControlPlansByYear'
import { customDayjs, type DateAsStringRange, getOptionsFromLabelledEnum, type Option } from '@mtes-mct/monitor-ui'
import _, { reduce } from 'lodash'
import { type MutableRefObject, useMemo, useRef } from 'react'

import { MapReportingsFilters } from './Map'
import { reportingsFiltersActions, ReportingsFiltersEnum, type SourceFilterProps } from './slice'
import { TableReportingsFilters } from './Table'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../api/constants'
import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { ReportingDateRangeLabels } from '../../../domain/entities/dateRange'
import {
  ReportingSourceEnum,
  ReportingSourceLabels,
  ReportingTypeLabels,
  StatusFilterLabels
} from '../../../domain/entities/reporting'
import { SeaFrontLabels } from '../../../domain/entities/seaFrontType'
import { ReportingTargetTypeLabels } from '../../../domain/entities/targetType'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../hooks/useGetControlPlans'

export enum ReportingFilterContext {
  MAP = 'MAP',
  TABLE = 'TABLE'
}

export type ReportingsOptionsListType = {
  dateRangeOptions: Option<string>[]
  seaFrontsOptions: Option<string>[]
  sourceOptions: Option<SourceFilterProps>[]
  sourceTypeOptions: Option<string>[]
  statusOptions: Option<string>[]
  subThemesOptions: Option<number>[]
  targetTypeOtions: Option<string>[]
  themesOptions: Option<number>[]
  typeOptions: Option<string>[]
}

export function ReportingsFilters({ context = ReportingFilterContext.TABLE }: { context?: string }) {
  const dispatch = useAppDispatch()
  const { sourceTypeFilter, startedAfter, startedBefore, subThemesFilter } = useAppSelector(
    state => state.reportingFilters
  )
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>

  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const startedAfterYear = useMemo(() => customDayjs(startedAfter).get('year'), [startedAfter])
  const startedBeforeYear = useMemo(() => customDayjs(startedBefore).get('year'), [startedBefore])
  const { subThemes, subThemesAsOptions, themesAsOptions } = useGetControlPlans()
  const { subThemesByYearAsOptions, themesByYearAsOptions } = useGetControlPlansByYear({ year: startedAfterYear })
  const themesAsOptionsPerPeriod = useMemo(() => {
    if (startedAfterYear === startedBeforeYear) {
      return themesByYearAsOptions
    }

    // TODO deal with 2-year periods
    return themesAsOptions
  }, [startedAfterYear, startedBeforeYear, themesAsOptions, themesByYearAsOptions])

  const subThemesAsOptionsPerPeriod = useMemo(() => {
    if (startedAfterYear === startedBeforeYear) {
      return subThemesByYearAsOptions
    }

    // TODO deal with 2-year periods
    return subThemesAsOptions
  }, [startedAfterYear, startedBeforeYear, subThemesAsOptions, subThemesByYearAsOptions])

  const { data: semaphores } = useGetSemaphoresQuery()
  const controlUnitsOptions = useMemo(() => (controlUnits ? Array.from(controlUnits) : []), [controlUnits])

  const unitListAsOptions = controlUnitsOptions
    .filter(unit => !unit.isArchived && !unit.name.includes('Sémaphore'))
    .sort((a, b) => a?.name?.localeCompare(b?.name))
    .map(sortedUnits => ({
      label: sortedUnits.name,
      value: {
        id: sortedUnits.id,
        label: sortedUnits.name
      }
    }))

  const semaphoresAsOptions = useMemo(
    () =>
      reduce(
        semaphores?.entities,
        (labels, semaphore) => {
          if (semaphore) {
            labels.push({
              label: semaphore.unit ?? semaphore.name,
              value: {
                id: semaphore.id,
                label: semaphore.unit ?? semaphore.name
              }
            })
          }

          return labels
        },
        [] as {
          label: string
          value: {
            id: number
            label: string
          }
        }[]
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [semaphores]
  )

  const sourceOptions = useMemo(() => {
    if (sourceTypeFilter && sourceTypeFilter.length === 1 && sourceTypeFilter[0] === ReportingSourceEnum.SEMAPHORE) {
      return semaphoresAsOptions
    }
    if (sourceTypeFilter && sourceTypeFilter.length === 1 && sourceTypeFilter[0] === ReportingSourceEnum.CONTROL_UNIT) {
      return unitListAsOptions
    }

    return _.chain(unitListAsOptions)
      .concat(semaphoresAsOptions)
      .sort((a, b) => a.label.localeCompare(b.label))
      .value()
  }, [unitListAsOptions, semaphoresAsOptions, sourceTypeFilter])

  const dateRangeOptions = getOptionsFromLabelledEnum(ReportingDateRangeLabels)
  const typeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)
  const sourceTypeOptions = getOptionsFromLabelledEnum(ReportingSourceLabels)
  const seaFrontsOptions = Object.values(SeaFrontLabels)
  const statusOptions = getOptionsFromLabelledEnum(StatusFilterLabels)
  const targetTypeOtions = getOptionsFromLabelledEnum(ReportingTargetTypeLabels)

  const optionsList = {
    dateRangeOptions,
    seaFrontsOptions,
    sourceOptions,
    sourceTypeOptions,
    statusOptions,
    subThemesOptions: subThemesAsOptionsPerPeriod,
    targetTypeOtions,
    themesOptions: themesAsOptionsPerPeriod,
    typeOptions
  }

  const updatePeriodFilter = period => {
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.PERIOD_FILTER, value: period }))

    // these filters are only uses when user selects a date range
    dispatch(
      reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_AFTER_FILTER, value: undefined })
    )
    dispatch(
      reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
    )

    // if we change the year, we reset the theme and subtheme filters
    const actuelFilterYear = startedAfter ? customDayjs(startedAfter).get('year') : undefined
    const currentYear = customDayjs().get('year')
    if (actuelFilterYear && currentYear !== actuelFilterYear) {
      dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.THEME_FILTER, value: undefined }))
      dispatch(
        reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SUB_THEMES_FILTER, value: undefined })
      )
    }
  }

  const updateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
        value: date && date[0] ? date[0] : undefined
      })
    )
    dispatch(
      reportingsFiltersActions.updateFilters({
        key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER,
        value: date && date[1] ? date[1] : undefined
      })
    )

    // if we change the year, we reset the theme and subtheme filters
    const actuelFilterYear = startedAfter ? customDayjs(startedAfter).get('year') : customDayjs().get('year')
    const newFilterYear = date && date[0] ? customDayjs(date[0]).get('year') : undefined
    if (newFilterYear && newFilterYear !== actuelFilterYear) {
      dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.THEME_FILTER, value: undefined }))
      dispatch(
        reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SUB_THEMES_FILTER, value: undefined })
      )
    }
  }

  const updateSimpleFilter = (value, filter) => {
    dispatch(reportingsFiltersActions.updateFilters({ key: filter, value }))
  }

  const updateCheckboxFilter = (isChecked, value, key, filter) => {
    const updatedFilter = [...filter]

    if (!isChecked && updatedFilter.includes(String(value))) {
      const newFilter = updatedFilter.filter(status => status !== String(value))
      dispatch(reportingsFiltersActions.updateFilters({ key, value: newFilter }))
    }
    if (isChecked && !updatedFilter.includes(value)) {
      const newFilter = [...updatedFilter, value]
      dispatch(reportingsFiltersActions.updateFilters({ key, value: newFilter }))
    }
  }

  const updateSourceTypeFilter = types => {
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SOURCE_TYPE_FILTER, value: types }))
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SOURCE_FILTER, value: undefined }))
  }

  const updateThemeFilter = (themesIds: number[] | undefined) => {
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.THEME_FILTER, value: themesIds }))

    if (themesIds) {
      const availableSubThemes = Object.values(subThemes)
        .filter(subTheme => themesIds.includes(subTheme.themeId))
        .map(subTheme => subTheme.id)
      dispatch(
        reportingsFiltersActions.updateFilters({
          key: ReportingsFiltersEnum.SUB_THEMES_FILTER,
          value: subThemesFilter?.filter(subThemeId => availableSubThemes.includes(subThemeId))
        })
      )
    } else {
      dispatch(
        reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SUB_THEMES_FILTER, value: undefined })
      )
    }
  }
  const resetFilters = () => {
    dispatch(reportingsFiltersActions.resetReportingsFilters())
  }

  return context === ReportingFilterContext.TABLE ? (
    <TableReportingsFilters
      ref={wrapperRef}
      optionsList={optionsList}
      resetFilters={resetFilters}
      updateCheckboxFilter={updateCheckboxFilter}
      updateDateRangeFilter={updateDateRangeFilter}
      updatePeriodFilter={updatePeriodFilter}
      updateSimpleFilter={updateSimpleFilter}
      updateSourceTypeFilter={updateSourceTypeFilter}
      updateThemeFilter={updateThemeFilter}
    />
  ) : (
    <MapReportingsFilters
      ref={wrapperRef}
      optionsList={optionsList}
      updateCheckboxFilter={updateCheckboxFilter}
      updateDateRangeFilter={updateDateRangeFilter}
      updatePeriodFilter={updatePeriodFilter}
      updateSimpleFilter={updateSimpleFilter}
      updateSourceTypeFilter={updateSourceTypeFilter}
    />
  )
}
