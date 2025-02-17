import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants.ts'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI.ts'
import { useGetSemaphoresQuery } from '@api/semaphoresAPI.ts'
import { useGetTagsQuery } from '@api/tagsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { useAppDispatch } from '@hooks/useAppDispatch.ts'
import { useAppSelector } from '@hooks/useAppSelector.ts'
import { customDayjs, type DateAsStringRange, getOptionsFromLabelledEnum, type Option } from '@mtes-mct/monitor-ui'
import { getDatesFromFilters } from '@utils/getDatesFromFilters'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { getThemesAsOptions } from '@utils/getThemesAsOptions'
import { chain, reduce } from 'lodash-es'
import { type MutableRefObject, useCallback, useMemo, useRef } from 'react'

import { MapReportingsFilters } from './Map'
import { reportingsFiltersActions, ReportingsFiltersEnum, type SourceFilterProps } from './slice'
import { TableReportingsFilters } from './Table'
import { ReportingDateRangeLabels } from '../../../domain/entities/dateRange'
import {
  ReportingSourceEnum,
  ReportingSourceLabels,
  ReportingTypeLabels,
  StatusFilterLabels
} from '../../../domain/entities/reporting'
import { SeaFrontLabels } from '../../../domain/entities/seaFrontType'
import { ReportingTargetTypeLabels } from '../../../domain/entities/targetType'

import type { TagOption } from '../../../domain/entities/tags'
import type { ThemeOption } from '../../../domain/entities/themes'

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
  tagsOptions: TagOption[]
  targetTypeOtions: Option<string>[]
  themesOptions: ThemeOption[]
  typeOptions: Option<string>[]
}
const dateRangeOptions = getOptionsFromLabelledEnum(ReportingDateRangeLabels)
const typeOptions = getOptionsFromLabelledEnum(ReportingTypeLabels)
const sourceTypeOptions = getOptionsFromLabelledEnum(ReportingSourceLabels)
const seaFrontsOptions = Object.values(SeaFrontLabels)
const statusOptions = getOptionsFromLabelledEnum(StatusFilterLabels)
const targetTypeOtions = getOptionsFromLabelledEnum(ReportingTargetTypeLabels)

export function ReportingsFilters({ context = ReportingFilterContext.TABLE }: { context?: string }) {
  const dispatch = useAppDispatch()
  const { periodFilter, sourceTypeFilter, startedAfter, startedBefore } = useAppSelector(
    state => state.reportingFilters
  )
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>

  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const dateRange: [string, string] = useMemo(() => {
    const { startedAfterDate, startedBeforeDate } = getDatesFromFilters({
      periodFilter,
      startedAfter,
      startedBefore,
      withLast24Hours: true
    })

    return [
      startedAfterDate ?? `${customDayjs().format('YYYY-MM-DD')}T00:00:00.00000Z`,
      startedBeforeDate ?? `${customDayjs().format('YYYY-MM-DD')}T00:00:00.00000Z`
    ]
  }, [periodFilter, startedAfter, startedBefore])

  const { data: theme } = useGetThemesQuery(dateRange)
  const themesOptions = useMemo(() => getThemesAsOptions(Object.values(theme ?? [])), [theme])

  const { data: tags } = useGetTagsQuery()
  const tagsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

  const { data: semaphores } = useGetSemaphoresQuery()
  const controlUnitsOptions = useMemo(() => (controlUnits ? Array.from(controlUnits) : []), [controlUnits])
  const unitListAsOptions = useMemo(
    () =>
      controlUnitsOptions
        .filter(unit => !unit.isArchived && !unit.name.includes('Sémaphore'))
        .sort((a, b) => a?.name?.localeCompare(b?.name))
        .map(sortedUnits => ({
          label: sortedUnits.name,
          value: {
            id: sortedUnits.id,
            label: sortedUnits.name
          }
        })),
    [controlUnitsOptions]
  )

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

    return chain(unitListAsOptions)
      .concat(semaphoresAsOptions)
      .sort((a, b) => a.label.localeCompare(b.label))
      .value()
  }, [unitListAsOptions, semaphoresAsOptions, sourceTypeFilter])

  const optionsList = useMemo(
    () => ({
      dateRangeOptions,
      seaFrontsOptions,
      sourceOptions,
      sourceTypeOptions,
      statusOptions,
      tagsOptions,
      targetTypeOtions,
      themesOptions,
      typeOptions
    }),
    [sourceOptions, tagsOptions, themesOptions]
  )

  const updatePeriodFilter = useCallback(
    period => {
      dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.PERIOD_FILTER, value: period }))

      // these filters are only uses when user selects a date range
      dispatch(
        reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_AFTER_FILTER, value: undefined })
      )
      dispatch(
        reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.STARTED_BEFORE_FILTER, value: undefined })
      )
    },
    [dispatch]
  )

  const updateDateRangeFilter = useCallback(
    (date: DateAsStringRange | undefined) => {
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
    },
    [dispatch]
  )

  const updateSimpleFilter = useCallback(
    (value: any, filter: ReportingsFiltersEnum) => {
      dispatch(reportingsFiltersActions.updateFilters({ key: filter, value }))
    },
    [dispatch]
  )

  const updateCheckboxFilter = useCallback(
    (isChecked, value, key, filter) => {
      const updatedFilter = [...filter]

      if (!isChecked && updatedFilter.includes(String(value))) {
        const newFilter = updatedFilter.filter(status => status !== String(value))
        dispatch(reportingsFiltersActions.updateFilters({ key, value: newFilter }))
      }
      if (isChecked && !updatedFilter.includes(value)) {
        const newFilter = [...updatedFilter, value]
        dispatch(reportingsFiltersActions.updateFilters({ key, value: newFilter }))
      }
    },
    [dispatch]
  )

  const updateSourceTypeFilter = useCallback(
    types => {
      dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SOURCE_TYPE_FILTER, value: types }))
      dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SOURCE_FILTER, value: undefined }))
    },
    [dispatch]
  )

  const resetFilters = useCallback(() => {
    dispatch(reportingsFiltersActions.resetReportingsFilters())
  }, [dispatch])

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
