import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { MissionSearch } from '@features/missions/MissionsSearch'
import { useGetControlPlansByYear } from '@hooks/useGetControlPlansByYear'
import {
  Checkbox,
  CheckPicker,
  customDayjs,
  CustomSearch,
  type DateAsStringRange,
  DateRangePicker,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum,
  Select,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { type MutableRefObject, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { useGetAdministrationsQuery } from '../../../../api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useGetLegacyControlUnitsQuery } from '../../../../api/legacyControlUnitsAPI'
import { DATE_RANGE_LABEL, DateRangeEnum } from '../../../../domain/entities/dateRange'
import { FrontCompletionStatusLabel, MissionStatusLabel, MissionTypeLabel } from '../../../../domain/entities/missions'
import { seaFrontLabels } from '../../../../domain/entities/seaFrontType'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from '../../../../domain/shared_slices/MissionFilters'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'
import { isNotArchived } from '../../../../utils/isNotArchived'

export function MissionsTableFilters() {
  const { newWindowContainerRef } = useNewWindow()

  const dispatch = useAppDispatch()
  const {
    hasFilters,
    selectedAdministrationNames,
    selectedCompletionStatus,
    selectedControlUnitIds,
    selectedMissionTypes,
    selectedPeriod,
    selectedSeaFronts,
    selectedStatuses,
    selectedThemes,
    selectedWithEnvActions,
    startedAfter,
    startedBefore
  } = useAppSelector(state => state.missionFilters)
  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>

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

  const themeCustomSearch = useMemo(
    () => new CustomSearch(themesAsOptionsPerPeriod, ['label']),
    [themesAsOptionsPerPeriod]
  )

  const controlUnitsAsOptions = useMemo(() => {
    const activeControlUnits = (legacyControlUnits ?? []).filter(isNotArchived)
    const selectableControlUnits = activeControlUnits?.filter(activeControlUnit =>
      selectedAdministrationNames?.length
        ? selectedAdministrationNames.includes(activeControlUnit.administration)
        : true
    )

    return getOptionsFromIdAndName(selectableControlUnits) ?? []
  }, [legacyControlUnits, selectedAdministrationNames])

  const controlUnitCustomSearch = useMemo(
    () => new CustomSearch(controlUnitsAsOptions, ['label'], { isStrict: true, threshold: 0.2 }),
    [controlUnitsAsOptions]
  )

  const dateRangesAsOptions = Object.values(DATE_RANGE_LABEL)
  const missionStatusesAsOptions = getOptionsFromLabelledEnum(MissionStatusLabel)
  const missionTypesAsOptions = getOptionsFromLabelledEnum(MissionTypeLabel)
  const seaFrontsAsOptions = Object.values(seaFrontLabels)
  const completionStatusAsOptions = getOptionsFromLabelledEnum(FrontCompletionStatusLabel)

  const onUpdatePeriodFilter = (nextDateRange: DateRangeEnum | undefined) => {
    dispatch(updateFilters({ key: MissionFiltersEnum.PERIOD_FILTER, value: nextDateRange }))

    // these filters are only uses when user selects a date range
    dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: undefined }))
    dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: undefined }))
  }

  const onUpdateAdministrationFilter = (nextSelectedAdministrationIds: string[] | undefined) => {
    const administrationsUpdatedWithUnits = administrations?.filter(admin =>
      nextSelectedAdministrationIds?.includes(admin.name)
    )

    const unitsFiltered = selectedControlUnitIds?.filter(unitId =>
      administrationsUpdatedWithUnits?.find(control => control.controlUnitIds.includes(unitId))
    )

    dispatch(updateFilters({ key: MissionFiltersEnum.UNIT_FILTER, value: unitsFiltered }))
    dispatch(updateFilters({ key: MissionFiltersEnum.ADMINISTRATION_FILTER, value: nextSelectedAdministrationIds }))
  }

  const onUpdateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: date && date[0] ? date[0] : undefined })
    )
    dispatch(
      updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: date && date[1] ? date[1] : undefined })
    )
  }

  const onUpdateSimpleFilter = (nextSelectedValues: number[] | undefined | boolean, filterKey: MissionFiltersEnum) => {
    dispatch(updateFilters({ key: filterKey, value: nextSelectedValues }))
  }

  const onResetFilters = () => {
    dispatch(resetMissionFilters())
  }
  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <>
      <FilterWrapper ref={unitPickerRef}>
        <MissionSearch />
        <FilterWrapperLine>
          <CheckPicker
            data-cy="select-seaFronts-filter"
            isLabelHidden
            isTransparent
            label="Façade"
            name="seaFront"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.SEA_FRONT_FILTER)}
            options={seaFrontsAsOptions}
            placeholder="Façade"
            renderValue={() => selectedSeaFronts && <OptionValue>{`Façade (${selectedSeaFronts.length})`}</OptionValue>}
            style={tagPickerStyle}
            value={selectedSeaFronts}
          />
          <CheckPicker
            data-cy="select-administration-filter"
            isLabelHidden
            isTransparent
            label="Administration"
            name="administration"
            onChange={onUpdateAdministrationFilter as any}
            options={activeAdministrations || []}
            placeholder="Administration"
            popupWidth={300}
            renderValue={() =>
              selectedAdministrationNames && (
                <OptionValue>{`Administration (${selectedAdministrationNames.length})`}</OptionValue>
              )
            }
            searchable
            style={tagPickerStyle}
            value={selectedAdministrationNames}
          />
          <CheckPicker
            key={controlUnitsAsOptions.length}
            customSearch={controlUnitCustomSearch}
            data-cy="select-units-filter"
            isLabelHidden
            isTransparent
            label="Unité"
            name="controlUnit"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.UNIT_FILTER)}
            options={controlUnitsAsOptions as any}
            placeholder="Unité"
            popupWidth={300}
            renderValue={() =>
              selectedControlUnitIds && <OptionValue>{`Unité (${selectedControlUnitIds.length})`}</OptionValue>
            }
            style={tagPickerStyle}
            value={selectedControlUnitIds}
          />
        </FilterWrapperLine>
        <FilterWrapperLine>
          <StyledSelect
            cleanable={false}
            data-cy="select-period-filter"
            isLabelHidden
            isTransparent
            label="Période"
            name="Période"
            onChange={onUpdatePeriodFilter as any}
            options={dateRangesAsOptions}
            placeholder="Date de mission depuis"
            style={tagPickerStyle}
            value={selectedPeriod}
          />

          <CheckPicker
            data-cy="select-types-filter"
            isLabelHidden
            isTransparent
            label="Type de mission"
            name="missionType"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.TYPE_FILTER)}
            options={missionTypesAsOptions}
            placeholder="Type de mission"
            renderValue={() =>
              selectedMissionTypes && <OptionValue>{`Type (${selectedMissionTypes.length})`}</OptionValue>
            }
            style={tagPickerStyle}
            value={selectedMissionTypes}
          />
          <CheckPicker
            key={`theme${themesAsOptionsPerPeriod.length}${JSON.stringify(selectedThemes)}`}
            customSearch={themeCustomSearch}
            data-cy="mission-theme-filter"
            isLabelHidden
            isTransparent
            label="Thématique"
            name="theme"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.THEME_FILTER)}
            options={themesAsOptionsPerPeriod}
            placeholder="Thématique"
            popupWidth={300}
            renderValue={() => selectedThemes && <OptionValue>{`Theme (${selectedThemes.length})`}</OptionValue>}
            style={tagPickerStyle}
            value={selectedThemes}
          />
          <CheckPicker
            data-cy="select-statuses-filter"
            isLabelHidden
            isTransparent
            label="Statut de mission"
            name="status"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.STATUS_FILTER)}
            options={missionStatusesAsOptions}
            placeholder="Statut de mission"
            renderValue={() => selectedStatuses && <OptionValue>{`Statut (${selectedStatuses.length})`}</OptionValue>}
            style={tagPickerStyle}
            value={selectedStatuses}
          />
          <CheckPicker
            data-cy="select-completion-statuses-filter"
            isLabelHidden
            isTransparent
            label="Etat des données"
            name="completion"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.COMPLETION_STATUS_FILTER)}
            options={completionStatusAsOptions}
            placeholder="Etat des données"
            renderValue={() =>
              selectedCompletionStatus && (
                <OptionValue>{`Etat des données (${selectedCompletionStatus.length})`}</OptionValue>
              )
            }
            style={tagPickerStyle}
            value={selectedCompletionStatus}
          />
          <Checkbox
            checked={selectedWithEnvActions}
            label="Missions avec actions CACEM"
            name="missionsWithEnvActions"
            onChange={value => onUpdateSimpleFilter(value ?? false, MissionFiltersEnum.WITH_ENV_ACTIONS_FILTER)}
          />
        </FilterWrapperLine>
      </FilterWrapper>
      <StyledTagsContainer $withTopMargin={selectedPeriod === DateRangeEnum.CUSTOM || hasFilters}>
        {selectedPeriod === DateRangeEnum.CUSTOM && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              baseContainer={newWindowContainerRef.current}
              data-cy="datepicker-missionStartedAfter"
              defaultValue={
                startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
              }
              isStringDate
              label="Période spécifique"
              name="missionDateRange"
              onChange={onUpdateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}
        <FilterTags />

        {hasFilters && <ReinitializeFiltersButton onClick={onResetFilters} />}
      </StyledTagsContainer>
    </>
  )
}

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
`
const FilterWrapperLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`

const tagPickerStyle = { width: 200 }

const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`

export const StyledTagsContainer = styled.div<{ $withTopMargin: boolean }>`
  margin-top: ${p => (p.$withTopMargin ? '16px' : '0px')};
  display: flex;
  flex-direction: row;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
`

const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
