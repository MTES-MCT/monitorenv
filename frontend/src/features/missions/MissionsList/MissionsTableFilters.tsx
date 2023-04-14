import { Option, Select, DatePicker, SingleTag, OptionValueType } from '@mtes-mct/monitor-ui'
import dayjs from 'dayjs'
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
  missionTypeEnum
} from '../../../domain/entities/missions'
import { THIRTY_DAYS_AGO, resetMissionFilters, updateFilters } from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useNewWindow } from '../../../ui/NewWindow'
import { ReactComponent as ReloadSVG } from '../../../uiMonitor/icons/Reload.svg'
import { getDateToIsoFormat } from '../../../utils/getDateToIsoFormat'
import { FilterTags } from './FilterTags'

export function MissionsTableFilters() {
  const dispatch = useDispatch()
  const { newWindowContainerRef } = useNewWindow()
  const {
    administrationFilter,
    periodFilter,
    sourceFilter,
    startedAfter,
    startedBefore,
    statusFilter,
    typeFilter,
    unitFilter
  } = useAppSelector(state => state.missionFilters)

  const [isCustomPeriodVisible, setIsCustomPeriodVisible] = useState(false)

  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>

  const { data } = useGetControlUnitsQuery()
  const controlUnits = useMemo(() => (data ? Array.from(data) : []), [data])

  const administrationListAsOptions: Option[] = _.chain(controlUnits)
    .map(unit => unit.administration)
    .uniq()
    .sort((a, b) => a?.localeCompare(b))
    .map(t => ({ label: t, value: t }))
    .value()

  const handleSetAdministrationFilter = administrationName => {
    dispatch(updateFilters({ key: 'administrationFilter', value: administrationName }))
    dispatch(updateFilters({ key: 'unitFilter', value: undefined }))
  }
  const unitListAsOptions: Option[] = controlUnits
    .filter(u => !u.isArchived)
    .sort((a, b) => a?.name?.localeCompare(b?.name))
    .map(t => ({ label: t.name, value: t.name }))

  const handleSetUnitFilter = unitName => {
    const administration = controlUnits.find(unit => unit.name === unitName)?.administration
    dispatch(updateFilters({ key: 'administrationFilter', value: administration }))
    dispatch(updateFilters({ key: 'unitFilter', value: unitName }))
  }
  const dateRangeEnumOptions = Object.values(dateRangeEnum)
  const onPeriodSelected = period => {
    const startDateTimeUtc = dayjs().toISOString()
    dispatch(updateFilters({ key: 'periodFilter', value: period }))
    switch (period) {
      case DateRangeEnum.DAY:
        dispatch(updateFilters({ key: 'startedAfter', value: getDateToIsoFormat('day', startDateTimeUtc) }))
        break

      case DateRangeEnum.WEEK:
        dispatch(updateFilters({ key: 'startedAfter', value: getDateToIsoFormat('week', startDateTimeUtc) }))
        break

      case DateRangeEnum.MONTH:
        dispatch(updateFilters({ key: 'startedAfter', value: getDateToIsoFormat('month', startDateTimeUtc) }))
        break

      case DateRangeEnum.CUSTOM:
        setIsCustomPeriodVisible(true)
        break

      default:
        dispatch(updateFilters({ key: 'startedAfter', value: THIRTY_DAYS_AGO }))
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

  const handleSetMissionStartedAfterFilter = (v: Date | undefined) => {
    dispatch(updateFilters({ key: 'startedAfter', value: v ? v.toISOString() : undefined }))
  }
  const handleSetMissionStartedBeforeFilter = (v: Date | undefined) => {
    dispatch(updateFilters({ key: 'startedBefore', value: v ? v.toISOString() : undefined }))
  }

  const handleResetFilters = () => {
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
          style={largeTagPickerStyle}
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
          renderValue={() => sourceFilter && <OptionValue>Origine (1) </OptionValue>}
          style={tagPickerStyle}
          value={sourceFilter}
        />
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          isLabelHidden
          label="Administrations"
          name="administrations"
          onChange={handleSetAdministrationFilter}
          options={administrationListAsOptions}
          placeholder="Administrations"
          renderValue={() => administrationFilter && <OptionValue>Administration (1) </OptionValue>}
          searchable
          style={largeTagPickerStyle}
          value={administrationFilter}
        />
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          data-cy="select-units-filter"
          isLabelHidden
          label="Unités"
          name="units"
          onChange={handleSetUnitFilter}
          options={unitListAsOptions}
          placeholder="Unités"
          renderValue={() => unitFilter && <OptionValue>Unité (1) </OptionValue>}
          searchable
          style={largeTagPickerStyle}
          value={unitFilter}
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

        {!_.isEmpty([
          ...statusFilter,
          ...typeFilter,
          startedAfter,
          startedBefore,
          administrationFilter,
          unitFilter,
          sourceFilter
        ]) && (
          <ResetFiltersButton onClick={handleResetFilters}>
            <ReloadSVG />
            Réinitialiser les filtres
          </ResetFiltersButton>
        )}
      </FilterWrapper>
      <FilterTags
        onDeleteAdministration={() => handleSetAdministrationFilter(undefined)}
        onDeleteSource={handleSetSourceFilter}
        onDeleteUnit={() => handleSetUnitFilter(undefined)}
      />
      {isCustomPeriodVisible && (
        <StyledCustomPeriodContainer>
          <StyledCutomPeriodLabel>Période spécifique</StyledCutomPeriodLabel>
          <StyledDatePickerContainer>
            <DatePicker
              key="missionStartedAfter"
              baseContainer={newWindowContainerRef.current}
              data-cy="datepicker-missionStartedAfter"
              defaultValue={startedAfter}
              isLabelHidden
              label="Date de début après le"
              onChange={handleSetMissionStartedAfterFilter}
            />
            <DatePicker
              key="missionStartedBefore"
              baseContainer={newWindowContainerRef.current}
              data-cy="datepicker-missionStartedBefore"
              defaultValue={startedBefore}
              isLabelHidden
              label="Date de début avant le"
              onChange={handleSetMissionStartedBeforeFilter}
            />
          </StyledDatePickerContainer>
        </StyledCustomPeriodContainer>
      )}
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
const largeTagPickerStyle = { width: 260 }

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
const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
`
const StyledCutomPeriodLabel = styled.span`
  font-size: 13px;
  color: ${COLORS.slateGray};
`

const StyledDatePickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`
const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
