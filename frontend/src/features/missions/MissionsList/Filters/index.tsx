import {
  Select,
  customDayjs,
  DateRangePicker,
  type DateAsStringRange,
  useNewWindow,
  getOptionsFromIdAndName
} from '@mtes-mct/monitor-ui'
import { type MutableRefObject, useMemo, useRef, useState } from 'react'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { FilterTags } from './FilterTags'
import { useGetAdministrationsQuery } from '../../../../api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useGetControlThemesQuery } from '../../../../api/controlThemesAPI'
import { useGetLegacyControlUnitsQuery } from '../../../../api/legacyControlUnitsAPI'
import { DateRangeEnum, DATE_RANGE_LABEL } from '../../../../domain/entities/dateRange'
import { missionSourceEnum, missionStatusLabels, missionTypeEnum } from '../../../../domain/entities/missions'
import { seaFrontLabels } from '../../../../domain/entities/seaFrontType'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from '../../../../domain/shared_slices/MissionFilters'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReactComponent as ReloadSVG } from '../../../../uiMonitor/icons/Reload.svg'
import { getThemesAsListOptions } from '../../../../utils/getThemesAsListOptions'
import { isNotArchived } from '../../../../utils/isNotArchived'

export function MissionsTableFilters() {
  const dispatch = useAppDispatch()
  const { newWindowContainerRef } = useNewWindow()
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
  const { data: legacyControlUnits } = useGetLegacyControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { data: controlThemes } = useGetControlThemesQuery()

  const activeAdministrations = useMemo(() => (administrations || []).filter(isNotArchived), [administrations])

  const themesAsOptions = useMemo(() => getThemesAsListOptions(controlThemes), [controlThemes])

  const controlUnitsAsOptions = useMemo(() => {
    const activeControlUnits = (legacyControlUnits || []).filter(isNotArchived)
    const selectableControlUnits = activeControlUnits.filter(activeControlUnit =>
      selectedAdministrationNames.length ? selectedAdministrationNames.includes(activeControlUnit.administration) : true
    )

    return getOptionsFromIdAndName(selectableControlUnits) || []
  }, [legacyControlUnits, selectedAdministrationNames])

  const dateRangesAsOptions = Object.values(DATE_RANGE_LABEL)
  const missionStatusesAsOptions = Object.values(missionStatusLabels)
  const missionTypesAsOptions = Object.values(missionTypeEnum)
  const missionSourcesAsOptions = Object.values(missionSourceEnum)
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

  const onUpdateSimpleFilter = (
    nextSelectedValues: string | number[] | string[] | undefined,
    filterKey: MissionFiltersEnum
  ) => {
    dispatch(updateFilters({ key: filterKey, value: nextSelectedValues }))
  }

  const onResetFilters = () => {
    setIsCustomPeriodVisible(false)
    dispatch(resetMissionFilters())
  }

  return (
    <>
      <FilterWrapper ref={unitPickerRef}>
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
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
          baseContainer={newWindowContainerRef.current}
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
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={activeAdministrations || []}
          data-cy="select-administration-filter"
          labelKey="name"
          onChange={onUpdateAdministrationFilter as any}
          placeholder="Administration"
          renderValue={() =>
            selectedAdministrationNames && (
              <OptionValue>{`Administration (${selectedAdministrationNames.length})`}</OptionValue>
            )
          }
          searchable
          size="sm"
          style={tagPickerStyle}
          value={selectedAdministrationNames}
          valueKey="name"
        />
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={controlUnitsAsOptions as any}
          data-cy="select-units-filter"
          labelKey="label"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.UNIT_FILTER)}
          placeholder="Unité"
          renderValue={() =>
            selectedControlUnitIds && <OptionValue>{`Unité (${selectedControlUnitIds.length})`}</OptionValue>
          }
          searchable
          size="sm"
          style={tagPickerStyle}
          value={selectedControlUnitIds}
          valueKey="value"
        />
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={missionTypesAsOptions}
          data-cy="select-types-filter"
          labelKey="libelle"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.TYPE_FILTER)}
          placeholder="Type de mission"
          renderValue={() =>
            selectedMissionTypes && <OptionValue>{`Type (${selectedMissionTypes.length})`}</OptionValue>
          }
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={selectedMissionTypes}
          valueKey="code"
        />
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={seaFrontsAsOptions}
          data-cy="select-seaFronts-filter"
          labelKey="label"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.SEA_FRONT_FILTER)}
          placeholder="Facade"
          renderValue={() => selectedSeaFronts && <OptionValue>{`Facade (${selectedSeaFronts.length})`}</OptionValue>}
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={selectedSeaFronts}
          valueKey="value"
        />
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={missionStatusesAsOptions}
          data-cy="select-statuses-filter"
          labelKey="libelle"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.STATUS_FILTER)}
          placeholder="Statut"
          renderValue={() => selectedStatuses && <OptionValue>{`Statut (${selectedStatuses.length})`}</OptionValue>}
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={selectedStatuses}
          valueKey="code"
        />
        <StyledCheckPicker
          container={newWindowContainerRef.current}
          data={themesAsOptions}
          data-cy="select-theme-filter"
          labelKey="label"
          onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.THEME_FILTER)}
          placeholder="Thématique"
          renderValue={() => selectedThemes && <OptionValue>{`Theme (${selectedThemes.length})`}</OptionValue>}
          size="sm"
          style={tagPickerStyle}
          value={selectedThemes}
          valueKey="value"
        />
      </FilterWrapper>
      <StyledTagsContainer>
        {isCustomPeriodVisible && (
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
              onChange={onUpdateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}
        <FilterTags />

        {hasFilters && (
          <ResetFiltersButton data-cy="reinitialize-filters" onClick={onResetFilters}>
            <ReloadSVG />
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
const StyledCheckPicker = styled(CheckPicker)`
  .rs-picker-toggle-placeholder {
    font-size: 13px !important;
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
