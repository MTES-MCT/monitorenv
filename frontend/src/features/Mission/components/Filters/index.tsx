import { useGetAdministrationsQuery } from '@api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetLegacyControlUnitsQuery } from '@api/legacyControlUnitsAPI'
import { useGetTagsQuery } from '@api/tagsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  customDayjs,
  type DateAsStringRange,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum,
  type Option
} from '@mtes-mct/monitor-ui'
import { getDatesFromFilters } from '@utils/getDatesFromFilters'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { getThemesAsOptionsCheckPicker } from '@utils/getThemesAsOptions'
import { isNotArchived } from '@utils/isNotArchived'
import { type DateRangeEnum, dateRangeOptions } from 'domain/entities/dateRange'
import { FrontCompletionStatusLabel, MissionStatusLabel, MissionTypeLabel } from 'domain/entities/missions'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from 'domain/shared_slices/MissionFilters'
import { type MutableRefObject, useCallback, useMemo, useRef } from 'react'

import { MapMissionsFilters } from './Map'
import { TableMissionsFilters } from './Table'

import type { TagOption } from '../../../../domain/entities/tags'

export enum MissionFilterContext {
  MAP = 'MAP',
  TABLE = 'TABLE'
}

export type MissionOptionsListType = {
  administrations: Option<string>[]
  completion: Option<string>[]
  controlUnits: Option<number>[]
  dates: Option<DateRangeEnum>[]
  seaFronts: Option<string>[]
  status: Option<string>[]
  tags: TagOption[]
  themes: Option<number>[]
  types: Option<string>[]
}

const missionStatusesAsOptions = getOptionsFromLabelledEnum(MissionStatusLabel)
const missionTypesAsOptions = getOptionsFromLabelledEnum(MissionTypeLabel)
const seaFrontsAsOptions = Object.values(SeaFrontLabels)
const completionStatusAsOptions = getOptionsFromLabelledEnum(FrontCompletionStatusLabel)

export function MissionFilters({ context }: { context: MissionFilterContext }) {
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>

  const dispatch = useAppDispatch()
  const { selectedAdministrationNames, selectedControlUnitIds, selectedPeriod, startedAfter, startedBefore } =
    useAppSelector(state => state.missionFilters)

  const dateRange: [string, string] = useMemo(() => {
    const { startedAfterDate, startedBeforeDate } = getDatesFromFilters({
      periodFilter: selectedPeriod,
      startedAfter,
      startedBefore
    })

    return [
      startedAfterDate ?? `${customDayjs().format('YYYY-MM-DD')}T00:00:00.00000Z`,
      startedBeforeDate ?? `${customDayjs().format('YYYY-MM-DD')}T00:00:00.00000Z`
    ]
  }, [selectedPeriod, startedAfter, startedBefore])

  const { data: administrations } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { data: legacyControlUnits, isLoading } = useGetLegacyControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const { data } = useGetThemesQuery(dateRange)
  const themesAsOptions = useMemo(() => getThemesAsOptionsCheckPicker(Object.values(data ?? [])), [data])

  const { data: tags } = useGetTagsQuery()
  const tagsAsOptions = useMemo(() => getTagsAsOptions(Object.values(tags ?? [])), [tags])

  const activeAdministrations = useMemo(
    () =>
      (administrations ?? []).filter(isNotArchived).map(admin => ({
        label: admin.name,
        value: admin.name
      })),
    [administrations]
  )

  const controlUnitsAsOptions = useMemo(() => {
    const activeControlUnits = (legacyControlUnits ?? []).filter(isNotArchived)
    const selectableControlUnits = activeControlUnits?.filter(
      activeControlUnit =>
        !selectedAdministrationNames?.length || selectedAdministrationNames?.includes(activeControlUnit.administration)
    )

    return getOptionsFromIdAndName(selectableControlUnits) ?? []
  }, [legacyControlUnits, selectedAdministrationNames])

  const optionsList = useMemo(
    () => ({
      administrations: activeAdministrations,
      completion: completionStatusAsOptions,
      controlUnits: controlUnitsAsOptions,
      dates: dateRangeOptions,
      seaFronts: seaFrontsAsOptions,
      status: missionStatusesAsOptions,
      tags: tagsAsOptions,
      themes: themesAsOptions,
      types: missionTypesAsOptions
    }),
    [activeAdministrations, controlUnitsAsOptions, tagsAsOptions, themesAsOptions]
  )

  const updatePeriodFilter = useCallback(
    (nextDateRange: DateRangeEnum | undefined) => {
      dispatch(updateFilters({ key: MissionFiltersEnum.PERIOD_FILTER, value: nextDateRange }))

      // these filters are only uses when user selects a date range
      dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: undefined }))
      dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: undefined }))

      // if we change the year, we reset the theme and subtheme filters
      const actuelFilterYear = startedAfter ? customDayjs(startedAfter).get('year') : undefined
      const currentYear = customDayjs().get('year')
      if (actuelFilterYear && currentYear !== actuelFilterYear) {
        dispatch(updateFilters({ key: MissionFiltersEnum.THEME_FILTER, value: undefined }))
      }
    },
    [dispatch, startedAfter]
  )

  const updateAdministrationFilter = useCallback(
    (nextSelectedAdministrationIds: string[] | undefined) => {
      const administrationsUpdatedWithUnits = administrations?.filter(admin =>
        nextSelectedAdministrationIds?.includes(admin.name)
      )

      const unitsFiltered = selectedControlUnitIds?.filter(unitId =>
        administrationsUpdatedWithUnits?.find(control => control.controlUnitIds.includes(unitId))
      )

      dispatch(
        updateFilters({
          key: MissionFiltersEnum.UNIT_FILTER,
          value: (unitsFiltered?.length ?? 0) > 0 ? unitsFiltered : undefined
        })
      )
      dispatch(updateFilters({ key: MissionFiltersEnum.ADMINISTRATION_FILTER, value: nextSelectedAdministrationIds }))
    },
    [administrations, dispatch, selectedControlUnitIds]
  )

  const updateDateRangeFilter = useCallback(
    (date: DateAsStringRange | undefined) => {
      dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: date?.[0] ? date[0] : undefined }))
      dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: date?.[1] ? date[1] : undefined }))

      // if we change the year, we reset the theme and subtheme filters
      const actuelFilterYear = startedAfter ? customDayjs(startedAfter).get('year') : customDayjs().get('year')
      const newFilterYear = date?.[0] ? customDayjs(date[0]).get('year') : undefined
      if (newFilterYear && newFilterYear !== actuelFilterYear) {
        dispatch(updateFilters({ key: MissionFiltersEnum.THEME_FILTER, value: undefined }))
      }
    },
    [dispatch, startedAfter]
  )

  const updateSimpleFilter = useCallback(
    (nextSelectedValues: number[] | undefined | boolean, filterKey: MissionFiltersEnum) => {
      dispatch(updateFilters({ key: filterKey, value: nextSelectedValues }))
    },
    [dispatch]
  )

  const resetFilters = useCallback(() => {
    dispatch(resetMissionFilters())
  }, [dispatch])

  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <>
      {context === MissionFilterContext.TABLE ? (
        <TableMissionsFilters
          ref={wrapperRef}
          onResetFilters={resetFilters}
          onUpdateAdministrationFilter={updateAdministrationFilter}
          onUpdateDateRangeFilter={updateDateRangeFilter}
          onUpdatePeriodFilter={updatePeriodFilter}
          onUpdateSimpleFilter={updateSimpleFilter}
          optionsList={optionsList}
        />
      ) : (
        <MapMissionsFilters
          ref={wrapperRef}
          onUpdateAdministrationFilter={updateAdministrationFilter}
          onUpdateDateRangeFilter={updateDateRangeFilter}
          onUpdatePeriodFilter={updatePeriodFilter}
          onUpdateSimpleFilter={updateSimpleFilter}
          optionsList={optionsList}
        />
      )}
    </>
  )
}
