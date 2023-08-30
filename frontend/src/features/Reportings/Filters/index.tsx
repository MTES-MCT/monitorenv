import { customDayjs, DateAsStringRange, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import _, { reduce } from 'lodash'
import { MutableRefObject, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { MapReportingsFilters } from './Map'
import { TableReportingsFilters } from './Table'
import { useGetControlThemesQuery } from '../../../api/controlThemesAPI'
import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { useGetSemaphoresQuery } from '../../../api/semaphoresAPI'
import { DateRangeEnum, ReportingDateRangeEnum, ReportingDateRangeLabels } from '../../../domain/entities/dateRange'
import {
  ReportingSourceEnum,
  // ProvenFiltersLabels,
  ReportingSourceLabels,
  ReportingTypeLabels,
  StatusFilterLabels
} from '../../../domain/entities/reporting'
import { seaFrontLabels } from '../../../domain/entities/seaFrontType'
import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../domain/shared_slices/ReportingsFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getSubThemesAsListOptions } from '../../../utils/getSubThemesAsListOptions'
import { getThemesAsListOptions } from '../../../utils/getThemesAsListOptions'

export enum ReportingFilterContext {
  MAP = 'MAP',
  TABLE = 'TABLE'
}
export function ReportingsFilters({ context = ReportingFilterContext.TABLE }: { context?: string }) {
  const dispatch = useDispatch()
  const {
    periodFilter,
    // provenFilter,
    sourceTypeFilter
  } = useAppSelector(state => state.reportingFilters)
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>
  const [isCustomPeriodVisible, setIsCustomPeriodVisible] = useState(periodFilter === DateRangeEnum.CUSTOM)

  const { data: themes } = useGetControlThemesQuery()
  const { data: controlUnits } = useGetControlUnitsQuery()
  const { data: semaphores } = useGetSemaphoresQuery()
  const controlUnitsOptions = useMemo(() => (controlUnits ? Array.from(controlUnits) : []), [controlUnits])

  const themesListAsOptions = getThemesAsListOptions(themes)
  const subThemesListAsOptions = getSubThemesAsListOptions(themes)

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
    if (sourceTypeFilter.length === 1 && sourceTypeFilter[0] === ReportingSourceEnum.SEMAPHORE) {
      return semaphoresAsOptions
    }
    if (sourceTypeFilter.length === 1 && sourceTypeFilter[0] === ReportingSourceEnum.CONTROL_UNIT) {
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
  // const isProvenOptions = getOptionsFromLabelledEnum(ProvenFiltersLabels)

  const optionsList = {
    dateRangeOptions,
    seaFrontsOptions,
    sourceOptions,
    sourceTypeOptions,
    statusOptions,
    subThemesListAsOptions,
    themesListAsOptions,
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
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SOURCE_FILTER, value: [] }))
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
