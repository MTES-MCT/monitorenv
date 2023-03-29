import { Option, Select } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { MutableRefObject, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckPicker, DatePicker } from 'rsuite'
import styled from 'styled-components'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { missionNatureEnum, missionStatusEnum, missionTypeEnum } from '../../../domain/entities/missions'
import {
  resetMissionFilters,
  setMissionAdministrationFilter,
  setMissionNatureFilter,
  setMissionStartedAfter,
  setMissionStartedBefore,
  setMissionStatusFilter,
  setMissionTypeFilter,
  setMissionUnitFilter
} from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useNewWindow } from '../../../ui/NewWindow'
import { ReactComponent as ReloadSVG } from '../../../uiMonitor/icons/Reload.svg'

export function MissionsTableFilters() {
  const dispatch = useDispatch()
  const { newWindowContainerRef } = useNewWindow()
  const {
    missionAdministrationFilter,
    missionNatureFilter,
    missionStartedAfter,
    missionStartedBefore,
    missionStatusFilter,
    missionTypeFilter,
    missionUnitFilter
  } = useAppSelector(state => state.missionFilters)

  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>
  const datepickerStartedAfterRef = useRef() as MutableRefObject<HTMLDivElement>
  const datepickerStartedBeforeRef = useRef() as MutableRefObject<HTMLDivElement>
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false)
  const handleDisplayAdvancedFilters = () => setDisplayAdvancedFilters(!displayAdvancedFilters)

  const { data } = useGetControlUnitsQuery()
  const controlUnits = useMemo(() => (data ? Array.from(data) : []), [data])

  const administrationListAsOptions: Option[] = _.chain(controlUnits)
    .map(unit => unit.administration)
    .uniq()
    .sort((a, b) => a?.localeCompare(b))
    .map(t => ({ label: t, value: t }))
    .value()

  const handleSetAdministrationFilter = administrationName => {
    dispatch(setMissionAdministrationFilter(administrationName))
    dispatch(setMissionUnitFilter(undefined))
  }

  const unitListAsOptions: Option[] = controlUnits
    .filter(u => !u.isArchived)
    .sort((a, b) => a?.name?.localeCompare(b?.name))
    .map(t => ({ label: t.name, value: t.name }))

  const handleSetUnitFilter = unitName => {
    const administration = controlUnits.find(unit => unit.name === unitName)?.administration
    dispatch(setMissionAdministrationFilter(administration))
    dispatch(setMissionUnitFilter(unitName))
  }

  const StatusOptions = Object.values(missionStatusEnum)
  const handleSetStatusFilter = v => {
    dispatch(setMissionStatusFilter(v))
  }
  const TypeOptions = Object.values(missionTypeEnum)
  const handleSetTypeFilter = v => {
    dispatch(setMissionTypeFilter(v))
  }
  const NatureOptions = Object.values(missionNatureEnum)
  const handleSetNatureFilter = v => {
    dispatch(setMissionNatureFilter(v))
  }
  const handleSetMissionStartedAfterFilter = (v: Date | null) => {
    dispatch(setMissionStartedAfter(v ? v.toISOString() : null))
  }
  const handleSetMissionStartedBeforeFilter = (v: Date | null) => {
    dispatch(setMissionStartedBefore(v ? v.toISOString() : null))
  }

  const handleResetFilters = () => {
    dispatch(resetMissionFilters())
  }
  const missionStartedAfterDate = (missionStartedAfter && new Date(missionStartedAfter)) || null
  const missionStartedBeforeDate = (missionStartedBefore && new Date(missionStartedBefore)) || null

  return (
    <>
      <Title>FILTRER LA LISTE</Title>
      <FilterWrapper ref={unitPickerRef}>
        <DatePickerWrapper ref={datepickerStartedAfterRef} data-cy="datepicker-missionStartedAfter">
          <DatePicker
            container={() => datepickerStartedAfterRef.current}
            onChange={handleSetMissionStartedAfterFilter}
            placeholder="Date de début après le"
            size="sm"
            value={missionStartedAfterDate}
          />
        </DatePickerWrapper>
        <DatePickerWrapper ref={datepickerStartedBeforeRef} data-cy="datepicker-missionStartedBefore">
          <DatePicker
            container={() => datepickerStartedBeforeRef.current}
            onChange={handleSetMissionStartedBeforeFilter}
            placeholder="Date de début avant le"
            size="sm"
            value={missionStartedBeforeDate}
          />
        </DatePickerWrapper>
        <CheckPicker
          container={() => unitPickerRef.current}
          data={StatusOptions}
          labelKey="libelle"
          onChange={handleSetStatusFilter}
          placeholder="Statut"
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={missionStatusFilter}
          valueKey="code"
        />
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          data-cy="select-administrations-filter"
          defaultValue={missionAdministrationFilter}
          isLabelHidden
          label="Administrations"
          name="administrations"
          onChange={handleSetAdministrationFilter}
          options={administrationListAsOptions}
          placeholder="Administrations"
          searchable
          style={largeTagPickerStyle}
        />
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          data-cy="select-units-filter"
          defaultValue={missionUnitFilter}
          isLabelHidden
          label="Unités"
          name="units"
          onChange={handleSetUnitFilter}
          options={unitListAsOptions}
          placeholder="Unités"
          searchable
          style={largeTagPickerStyle}
        />
        <CheckPicker
          container={() => unitPickerRef.current}
          data={TypeOptions}
          labelKey="libelle"
          onChange={handleSetTypeFilter}
          placeholder="Type de mission"
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={missionTypeFilter}
          valueKey="code"
        />
        <CheckPicker
          container={() => unitPickerRef.current}
          data={NatureOptions}
          labelKey="libelle"
          onChange={handleSetNatureFilter}
          placeholder="Nature de contrôle"
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={missionNatureFilter}
          valueKey="code"
        />
        <AdvancedFiltersButton onClick={handleDisplayAdvancedFilters}>
          {displayAdvancedFilters ? 'Masquer les critères avancés' : 'Voir plus de critères'}
        </AdvancedFiltersButton>
        <Separator />

        {!_.isEmpty(
          [
            ...missionStatusFilter,
            ...missionNatureFilter,
            ...missionTypeFilter,
            missionStartedAfter,
            missionStartedBefore,
            missionAdministrationFilter,
            missionUnitFilter
          ].filter(v => v)
        ) && (
          <ResetFiltersButton onClick={handleResetFilters}>
            <ReloadIcon />
            Réinitialiser les filtres
          </ResetFiltersButton>
        )}
      </FilterWrapper>
      {displayAdvancedFilters && (
        <AdvancedFiltersWrapper>
          <CheckPicker
            data={[
              { label: 'NAMO', value: 'NAMO' },
              { label: 'MED', value: 'MED' }
            ]}
            placeholder="Facade"
            style={tagPickerStyle}
          />
        </AdvancedFiltersWrapper>
      )}
    </>
  )
}

const ReloadIcon = styled(ReloadSVG)``

const Title = styled.h2`
  font-size: 16px;
`

const FilterWrapper = styled.div`
  display: flex;
  height: 30px;
`
const AdvancedFiltersButton = styled.span`
  display: none;
  text-decoration: underline;
`

const ResetFiltersButton = styled.div`
  text-decoration: underline;
  cursor: pointer;
  svg {
    margin-right: 5px;
  }
`

const AdvancedFiltersWrapper = styled.div`
  display: flex;
`
const Separator = styled.div`
  flex: 1;
`
const tagPickerStyle = { margin: '2px 10px 10px 0', verticalAlign: 'top', width: 160 }
const largeTagPickerStyle = { margin: '2px 10px 10px 0', verticalAlign: 'top', width: 260 }

const DatePickerWrapper = styled.div`
  margin-right: 8px;
  margin-top: 2px;
  min-width: 150px;
  min-height: 20px;
  .rs-picker-date-menu {
    position: relative;
    margin-top: -32px;
  }
`

export const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`
