import {
  Select,
  customDayjs,
  DateRangePicker,
  type DateAsStringRange,
  getOptionsFromIdAndName,
  CheckPicker,
  getOptionsFromLabelledEnum,
  CustomSearch,
  Icon
} from '@mtes-mct/monitor-ui'
import { type MutableRefObject, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { useGetAdministrationsQuery } from '../../../../api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useGetLegacyControlUnitsQuery } from '../../../../api/legacyControlUnitsAPI'
import { DateRangeEnum, DATE_RANGE_LABEL } from '../../../../domain/entities/dateRange'
import { MissionSourceLabel, MissionTypeLabel, MissionStatusLabel } from '../../../../domain/entities/missions'
import { seaFrontLabels } from '../../../../domain/entities/seaFrontType'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from '../../../../domain/shared_slices/MissionFilters'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'
import { isNotArchived } from '../../../../utils/isNotArchived'

export function MissionsTableFilters() {
  const dispatch = useAppDispatch()
  const {
    hasFilters,
    selectedAdministrationNames,
    selectedControlUnitIds,
    selectedMissionSource,
    selectedMissionTypes,
    selectedPeriod,
    selectedSeaFronts,
    selectedStatuses,
    selectedThemes,
    startedAfter,
    startedBefore
  } = useAppSelector(state => state.missionFilters)
  const [isCustomPeriodVisible, setIsCustomPeriodVisible] = useState(selectedPeriod === DateRangeEnum.CUSTOM)
  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>

  const { data: administrations } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { data: legacyControlUnits, isLoading } = useGetLegacyControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { themesAsOptions } = useGetControlPlans()

  const activeAdministrations = useMemo(
    () =>
      (administrations ?? []).filter(isNotArchived).map(admin => ({
        label: admin.name,
        value: admin.name
      })),
    [administrations]
  )

  const themeCustomSearch = useMemo(() => new CustomSearch(themesAsOptions, ['label']), [themesAsOptions])

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
  const missionSourcesAsOptions = getOptionsFromLabelledEnum(MissionSourceLabel)
  const seaFrontsAsOptions = Object.values(seaFrontLabels)

  const onUpdatePeriodFilter = (nextDateRange: DateRangeEnum | undefined) => {
    dispatch(updateFilters({ key: MissionFiltersEnum.PERIOD_FILTER, value: nextDateRange }))
    setIsCustomPeriodVisible(false)

    switch (nextDateRange) {
      case DateRangeEnum.DAY:
        dispatch(
          updateFilters({
            key: MissionFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs().utc().startOf('day').toISOString()
          })
        )
        dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: undefined }))
        break

      case DateRangeEnum.WEEK:
        dispatch(
          updateFilters({
            key: MissionFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: undefined }))
        break

      case DateRangeEnum.MONTH:
        dispatch(
          updateFilters({
            key: MissionFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(30, 'day').toISOString()
          })
        )
        dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: undefined }))
        break

      case DateRangeEnum.CUSTOM:
        setIsCustomPeriodVisible(true)
        break

      default:
        dispatch(
          updateFilters({
            key: MissionFiltersEnum.STARTED_AFTER_FILTER,
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: undefined }))
        break
    }
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

  const onUpdateSimpleFilter = (nextSelectedValues: number[] | undefined, filterKey: MissionFiltersEnum) => {
    dispatch(updateFilters({ key: filterKey, value: nextSelectedValues }))
  }

  const onResetFilters = () => {
    setIsCustomPeriodVisible(false)
    dispatch(resetMissionFilters())
  }
  if (isLoading) {
    return <div>Chargement</div>
  }

  return (
    <>
      <FilterWrapper ref={unitPickerRef}>
        <StyledSelect
          cleanable={false}
          data-cy="select-period-filter"
          isLabelHidden
          label="Période"
          name="Période"
          onChange={onUpdatePeriodFilter as any}
          options={dateRangesAsOptions}
          placeholder="Date de mission depuis"
          style={tagPickerStyle}
          value={selectedPeriod}
        />

        <StyledSelect
          data-cy="select-origin-filter"
          isLabelHidden
          label="Origine"
          name="origine"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.SOURCE_FILTER)}
          options={missionSourcesAsOptions}
          placeholder="Origine"
          style={tagPickerStyle}
          value={selectedMissionSource}
        />
        <CheckPicker
          data-cy="select-administration-filter"
          isLabelHidden
          label="Administration"
          menuStyle={{ maxWidth: '200%' }}
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
          label="Unité"
          menuStyle={{ maxWidth: '200%' }}
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
        <CheckPicker
          data-cy="select-types-filter"
          isLabelHidden
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
          data-cy="select-seaFronts-filter"
          isLabelHidden
          label="Facade"
          menuStyle={{ maxWidth: '150%' }}
          name="seaFront"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.SEA_FRONT_FILTER)}
          options={seaFrontsAsOptions}
          placeholder="Facade"
          renderValue={() => selectedSeaFronts && <OptionValue>{`Facade (${selectedSeaFronts.length})`}</OptionValue>}
          style={tagPickerStyle}
          value={selectedSeaFronts}
        />
        <CheckPicker
          data-cy="select-statuses-filter"
          isLabelHidden
          label="Statut"
          name="status"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.STATUS_FILTER)}
          options={missionStatusesAsOptions}
          placeholder="Statut"
          renderValue={() => selectedStatuses && <OptionValue>{`Statut (${selectedStatuses.length})`}</OptionValue>}
          style={tagPickerStyle}
          value={selectedStatuses}
        />
        <CheckPicker
          customSearch={themeCustomSearch}
          data-cy="select-theme-filter"
          isLabelHidden
          label="Thématique"
          menuStyle={{ maxWidth: '200%' }}
          name="theme"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.THEME_FILTER)}
          options={themesAsOptions}
          placeholder="Thématique"
          popupWidth={300}
          renderValue={() => selectedThemes && <OptionValue>{`Theme (${selectedThemes.length})`}</OptionValue>}
          style={tagPickerStyle}
          value={selectedThemes}
        />
      </FilterWrapper>
      <StyledTagsContainer>
        {isCustomPeriodVisible && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
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

        {hasFilters && (
          <ResetFiltersButton data-cy="reinitialize-filters" onClick={onResetFilters}>
            <Icon.Reset size={14} />
            Réinitialiser les filtres
          </ResetFiltersButton>
        )}
      </StyledTagsContainer>
    </>
  )
}

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 10px;
`

const ResetFiltersButton = styled.div`
  text-decoration: underline;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-top: 10px;
  svg {
    margin-right: 5px;
  }
`

const tagPickerStyle = { width: 160 }

const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`

const StyledTagsContainer = styled.div`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 16px;
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
