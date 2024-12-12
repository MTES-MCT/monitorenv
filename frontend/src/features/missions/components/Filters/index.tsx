import { useGetAdministrationsQuery } from '@api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetLegacyControlUnitsQuery } from '@api/legacyControlUnitsAPI'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { useGetControlPlansByYear } from '@hooks/useGetControlPlansByYear'
import {
  customDayjs,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum,
  type DateAsStringRange,
  type Option
} from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { dateRangeOptions, type DateRangeEnum } from 'domain/entities/dateRange'
import { FrontCompletionStatusLabel, MissionStatusLabel, MissionTypeLabel } from 'domain/entities/missions'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from 'domain/shared_slices/MissionFilters'
import { useMemo, useRef, type MutableRefObject } from 'react'

import { MapMissionFilters } from './Map'
import { TableMissionFilters } from './Table'

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
  themes: Option<number>[]
  types: Option<string>[]
}

export function MissionFilters({ context }: { context: MissionFilterContext }) {
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>

  const dispatch = useAppDispatch()
  const { selectedAdministrationNames, selectedControlUnitIds, startedAfter, startedBefore } = useAppSelector(
    state => state.missionFilters
  )

  const { data: administrations } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { data: legacyControlUnits, isLoading } = useGetLegacyControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const startedAfterYear = customDayjs(startedAfter).get('year')
  const { themesAsOptions } = useGetControlPlans()
  const { themesByYearAsOptions } = useGetControlPlansByYear({ year: startedAfterYear })

  const themesAsOptionsPerPeriod = useMemo(() => {
    const startedBeforeYear = customDayjs(startedBefore).get('year')

    if (startedAfterYear === startedBeforeYear) {
      return themesByYearAsOptions
    }

    // TODO deal with 2-year periods
    return themesAsOptions
  }, [startedAfterYear, startedBefore, themesAsOptions, themesByYearAsOptions])

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
    const selectableControlUnits = activeControlUnits?.filter(activeControlUnit =>
      selectedAdministrationNames?.includes(activeControlUnit.administration)
    )

    return getOptionsFromIdAndName(selectableControlUnits) ?? []
  }, [legacyControlUnits, selectedAdministrationNames])

  const missionStatusesAsOptions = getOptionsFromLabelledEnum(MissionStatusLabel)
  const missionTypesAsOptions = getOptionsFromLabelledEnum(MissionTypeLabel)
  const seaFrontsAsOptions = Object.values(SeaFrontLabels)
  const completionStatusAsOptions = getOptionsFromLabelledEnum(FrontCompletionStatusLabel)

  const optionsList = {
    administrations: activeAdministrations,
    completion: completionStatusAsOptions,
    controlUnits: controlUnitsAsOptions,
    dates: dateRangeOptions,
    seaFronts: seaFrontsAsOptions,
    status: missionStatusesAsOptions,
    themes: themesAsOptionsPerPeriod,
    types: missionTypesAsOptions
  }

  const updatePeriodFilter = (nextDateRange: DateRangeEnum | undefined) => {
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
  }

  const updateAdministrationFilter = (nextSelectedAdministrationIds: string[] | undefined) => {
    const administrationsUpdatedWithUnits = administrations?.filter(admin =>
      nextSelectedAdministrationIds?.includes(admin.name)
    )

    const unitsFiltered = selectedControlUnitIds?.filter(unitId =>
      administrationsUpdatedWithUnits?.find(control => control.controlUnitIds.includes(unitId))
    )

    dispatch(updateFilters({ key: MissionFiltersEnum.UNIT_FILTER, value: unitsFiltered }))
    dispatch(updateFilters({ key: MissionFiltersEnum.ADMINISTRATION_FILTER, value: nextSelectedAdministrationIds }))
  }

  const updateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: date && date[0] ? date[0] : undefined })
    )
    dispatch(
      updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: date && date[1] ? date[1] : undefined })
    )

    // if we change the year, we reset the theme and subtheme filters
    const actuelFilterYear = startedAfter ? customDayjs(startedAfter).get('year') : customDayjs().get('year')
    const newFilterYear = date && date[0] ? customDayjs(date[0]).get('year') : undefined
    if (newFilterYear && newFilterYear !== actuelFilterYear) {
      dispatch(updateFilters({ key: MissionFiltersEnum.THEME_FILTER, value: undefined }))
    }
  }

  const updateSimpleFilter = (nextSelectedValues: number[] | undefined | boolean, filterKey: MissionFiltersEnum) => {
    dispatch(updateFilters({ key: filterKey, value: nextSelectedValues }))
  }

  const resetFilters = () => {
    dispatch(resetMissionFilters())
  }
  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <>
      {context === MissionFilterContext.TABLE ? (
        <TableMissionFilters
          ref={wrapperRef}
          onResetFilters={resetFilters}
          onUpdateAdministrationFilter={updateAdministrationFilter}
          onUpdateDateRangeFilter={updateDateRangeFilter}
          onUpdatePeriodFilter={updatePeriodFilter}
          onUpdateSimpleFilter={updateSimpleFilter}
          optionsList={optionsList}
        />
      ) : (
        <MapMissionFilters
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
