import { customDayjs, type DateAsStringRange, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import _, { reduce } from 'lodash'
import { type MutableRefObject, useMemo, useRef, useState } from 'react'

import { MapReportingsFilters } from './Map'
import { TableReportingsFilters } from './Table'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../api/constants'
import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { DateRangeEnum, ReportingDateRangeEnum, ReportingDateRangeLabels } from '../../../domain/entities/dateRange'
import {
  ReportingSourceEnum,
  ReportingSourceLabels,
  ReportingTypeLabels,
  StatusFilterLabels
} from '../../../domain/entities/reporting'
import { seaFrontLabels } from '../../../domain/entities/seaFrontType'
import { ReportingTargetTypeLabels } from '../../../domain/entities/targetType'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../domain/shared_slices/ReportingsFilters'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../hooks/useGetControlPlans'

export enum ReportingFilterContext {
  MAP = 'MAP',
  TABLE = 'TABLE'
}
export function ReportingsFilters({ context = ReportingFilterContext.TABLE }: { context?: string }) {
  const dispatch = useAppDispatch()
  const { periodFilter, sourceTypeFilter, subThemesFilter } = useAppSelector(state => state.reportingFilters)
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>
  const [isCustomPeriodVisible, setIsCustomPeriodVisible] = useState(periodFilter === DateRangeEnum.CUSTOM)

  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { subThemes, subThemesAsOptions, themesAsOptions } = useGetControlPlans()
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
              label: semaphore.unit || semaphore.name,
              value: {
                id: semaphore.id,
                label: semaphore.unit || semaphore.name
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
  const seaFrontsOptions = Object.values(seaFrontLabels)
  const statusOptions = getOptionsFromLabelledEnum(StatusFilterLabels)
  const targetTypeOtions = getOptionsFromLabelledEnum(ReportingTargetTypeLabels)

  const optionsList = {
    dateRangeOptions,
    seaFrontsOptions,
    sourceOptions,
    sourceTypeOptions,
    statusOptions,
    subThemesOptions: subThemesAsOptions,
    targetTypeOtions,
    themesOptions: themesAsOptions,
    typeOptions
  }

  const updatePeriodFilter = period => {
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.PERIOD_FILTER, value: period }))
    setIsCustomPeriodVisible(false)
    switch (period) {
      case ReportingDateRangeEnum.DAY:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().subtract(24, 'hour').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case ReportingDateRangeEnum.WEEK:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case ReportingDateRangeEnum.MONTH:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(30, 'day').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break
      case ReportingDateRangeEnum.YEAR:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('year').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break

      case ReportingDateRangeEnum.CUSTOM:
        setIsCustomPeriodVisible(true)
        break

      default:
        dispatch(
          reportingsFiltersActions.updateFilters({
            key: ReportingsFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(
          reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
        )
        break
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
  }

  const updateSimpleFilter = (value, filter) => {
    dispatch(reportingsFiltersActions.updateFilters({ key: filter, value }))
  }

  const updateCheckboxFilter = (isChecked, value, key, filter) => {
    const updatedFilter = [...filter] || []

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
    setIsCustomPeriodVisible(false)
    dispatch(reportingsFiltersActions.resetReportingsFilters())
  }

  return context === ReportingFilterContext.TABLE ? (
    <TableReportingsFilters
      ref={wrapperRef}
      isCustomPeriodVisible={isCustomPeriodVisible}
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
      isCustomPeriodVisible={isCustomPeriodVisible}
      optionsList={optionsList}
      updateCheckboxFilter={updateCheckboxFilter}
      updateDateRangeFilter={updateDateRangeFilter}
      updatePeriodFilter={updatePeriodFilter}
      updateSimpleFilter={updateSimpleFilter}
      updateSourceTypeFilter={updateSourceTypeFilter}
    />
  )
}
