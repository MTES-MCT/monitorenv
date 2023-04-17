import { Option, Select, customDayjs, DateRangePicker, DateAsStringRange } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { MutableRefObject, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { COLORS } from '../../../constants/constants'
import {
  DateRangeEnum,
  dateRangeEnum,
  missionSourceEnum,
  missionStatusLabels,
  missionTypeEnum,
  seaFrontEnum
} from '../../../domain/entities/missions'
import { resetMissionFilters, updateFilters } from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useNewWindow } from '../../../ui/NewWindow'
import { ReactComponent as ReloadSVG } from '../../../uiMonitor/icons/Reload.svg'
import { FilterTags } from './FilterTags'

export function MissionsTableFilters() {
  const dispatch = useDispatch()
  const { newWindowContainerRef } = useNewWindow()
  const {
    administrationFilter,
    hasNoFilter,
    periodFilter,
    seaFrontFilter,
    sourceFilter,
    statusFilter,
    typeFilter,
    unitFilter
  } = useAppSelector(state => state.missionFilters)
  const [isCustomPeriodVisible, setIsCustomPeriodVisible] = useState(false)

  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>

  const { data } = useGetControlUnitsQuery()
  const controlUnits = useMemo(() => (data ? Array.from(data) : []), [data])

  const filteredAdministrations = controlUnits.filter(unitToFilter => {
    if (unitFilter.length > 0) {
      return unitFilter.find(unit => unit === unitToFilter.name)
    }

    return unitToFilter
  })

  const administrationListAsOptions: Option[] = _.chain(filteredAdministrations)
    .map(unit => unit.administration)
    .uniq()
    .sort((a, b) => a?.localeCompare(b))
    .map(t => ({ label: t, value: t }))
    .value()

  const handleSetAdministrationFilter = administrations => {
    dispatch(updateFilters({ key: 'administrationFilter', value: administrations }))
  }
  const unitListAsOptions: Option[] = controlUnits
    .filter(u => !u.isArchived)
    .filter(unitToFilter => {
      if (administrationFilter.length > 0) {
        return administrationFilter.find(admin => admin === unitToFilter.administration)
      }

      return unitToFilter
    })
    .sort((a, b) => a?.name?.localeCompare(b?.name))
    .map(t => ({ label: t.name, value: t.name }))

  const handleSetUnitFilter = unitName => {
    dispatch(updateFilters({ key: 'unitFilter', value: unitName }))
  }

  const dateRangeEnumOptions = Object.values(dateRangeEnum)
  const onPeriodSelected = period => {
    dispatch(updateFilters({ key: 'periodFilter', value: period }))
    switch (period) {
      case DateRangeEnum.DAY:
        dispatch(updateFilters({ key: 'startedAfter', value: customDayjs().utc().startOf('day').toISOString() }))
        dispatch(updateFilters({ key: 'startedBefore', value: undefined }))
        break

      case DateRangeEnum.WEEK:
        dispatch(
          updateFilters({
            key: 'startedAfter',
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(updateFilters({ key: 'startedBefore', value: undefined }))
        break

      case DateRangeEnum.MONTH:
        dispatch(
          updateFilters({
            key: 'startedAfter',
            value: customDayjs.utc().startOf('day').utc().subtract(30, 'day').toISOString()
          })
        )
        dispatch(updateFilters({ key: 'startedBefore', value: undefined }))
        break

      case DateRangeEnum.CUSTOM:
        setIsCustomPeriodVisible(true)
        break

      default:
        dispatch(
          updateFilters({
            key: 'startedAfter',
            value: customDayjs.utc().startOf('day').utc().subtract(7, 'day').toISOString()
          })
        )
        dispatch(updateFilters({ key: 'startedBefore', value: undefined }))
        break
    }
  }
  const StatusOptions = Object.values(missionStatusLabels)
  const handleSetStatusFilter = v => {
    dispatch(updateFilters({ key: 'statusFilter', value: v }))
  }
  const TypeOptions = Object.values(missionTypeEnum)
  const handleSetTypeFilter = v => {
    dispatch(updateFilters({ key: 'typeFilter', value: v }))
  }

  const sourceOptions = Object.values(missionSourceEnum)
  const handleSetSourceFilter = value => {
    dispatch(updateFilters({ key: 'sourceFilter', value }))
  }

  const seaFrontsOptions = Object.values(seaFrontEnum)
  const handleSetSeaFrontFilter = value => {
    dispatch(updateFilters({ key: 'seaFrontFilter', value }))
  }
  const handleSetMissionStartedAfterFilter = (date: DateAsStringRange | undefined) => {
    dispatch(updateFilters({ key: 'startedAfter', value: date && date[0] ? date[0] : undefined }))
    dispatch(updateFilters({ key: 'startedBefore', value: date && date[1] ? date[1] : undefined }))
  }

  const handleResetFilters = () => {
    setIsCustomPeriodVisible(false)
    dispatch(resetMissionFilters())
  }

  return (
    <>
      <Title>FILTRER LA LISTE</Title>
      <FilterWrapper ref={unitPickerRef}>
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          isLabelHidden
          label="Période"
          name="Période"
          onChange={onPeriodSelected}
          options={dateRangeEnumOptions}
          placeholder="Date de mission depuis"
          style={tagPickerStyle}
          value={periodFilter}
        />

        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          data-cy="select-origin-filter"
          isLabelHidden
          label="Origine"
          name="origine"
          onChange={handleSetSourceFilter}
          options={sourceOptions}
          placeholder="Origine"
          style={tagPickerStyle}
          value={sourceFilter}
        />
        <StyledCheckPicker
          container={() => unitPickerRef.current}
          data={administrationListAsOptions}
          labelKey="label"
          onChange={handleSetAdministrationFilter}
          placeholder="Administrations"
          renderValue={() =>
            administrationFilter && <OptionValue>{`Administration (${administrationFilter.length})`}</OptionValue>
          }
          searchable
          size="sm"
          style={tagPickerStyle}
          value={administrationFilter}
          valueKey="value"
        />
        <StyledCheckPicker
          container={() => unitPickerRef.current}
          data={unitListAsOptions}
          labelKey="label"
          onChange={handleSetUnitFilter}
          placeholder="Unités"
          renderValue={() => unitFilter && <OptionValue>{`Unité (${unitFilter.length})`}</OptionValue>}
          searchable
          size="sm"
          style={tagPickerStyle}
          value={unitFilter}
          valueKey="value"
        />
        <StyledCheckPicker
          container={() => unitPickerRef.current}
          data={TypeOptions}
          labelKey="libelle"
          onChange={handleSetTypeFilter}
          placeholder="Type de mission"
          renderValue={() => typeFilter && <OptionValue>{`Type (${typeFilter.length})`}</OptionValue>}
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={typeFilter}
          valueKey="code"
        />
        <StyledCheckPicker
          container={() => unitPickerRef.current}
          data={seaFrontsOptions}
          labelKey="label"
          onChange={handleSetSeaFrontFilter}
          placeholder="Facade"
          renderValue={() => seaFrontFilter && <OptionValue>{`Facade (${seaFrontFilter.length})`}</OptionValue>}
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={seaFrontFilter}
          valueKey="value"
        />
        <StyledCheckPicker
          container={() => unitPickerRef.current}
          data={StatusOptions}
          labelKey="libelle"
          onChange={handleSetStatusFilter}
          placeholder="Statut"
          renderValue={() => statusFilter && <OptionValue>{`Statut (${statusFilter.length})`}</OptionValue>}
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={statusFilter}
          valueKey="code"
        />
      </FilterWrapper>
      {isCustomPeriodVisible && <StyledCutomPeriodLabel>Période spécifique</StyledCutomPeriodLabel>}
      <StyledTagsContainer>
        {isCustomPeriodVisible && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              baseContainer={newWindowContainerRef.current}
              data-cy="datepicker-missionStartedAfter"
              isLabelHidden
              isStringDate
              label="Date de début entre le et le"
              onChange={handleSetMissionStartedAfterFilter}
            />
          </StyledCustomPeriodContainer>
        )}
        <FilterTags />

        {!hasNoFilter && (
          <ResetFiltersButton onClick={handleResetFilters}>
            <ReloadSVG />
            Réinitialiser les filtres
          </ResetFiltersButton>
        )}
      </StyledTagsContainer>
    </>
  )
}

const Title = styled.h2`
  font-size: 16px;
`

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
  display: flex;
  flex-direction row;
  gap: 16px;
  align-items: baseline;
`
const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
`
const StyledCutomPeriodLabel = styled.span`
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin-top: 16px;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
