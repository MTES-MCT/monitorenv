import { Option, Select, DatePicker } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { MutableRefObject, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import {
  missionSourceEnum,
  missionNatureEnum,
  missionStatusLabels,
  missionTypeEnum
} from '../../../domain/entities/missions'
import {
  resetMissionFilters,
  setMissionAdministrationFilter,
  setMissionNatureFilter,
  setMissionSourceFilter,
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
    missionSourceFilter,
    missionStartedAfter,
    missionStartedBefore,
    missionStatusFilter,
    missionTypeFilter,
    missionUnitFilter
  } = useAppSelector(state => state.missionFilters)

  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>
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

  const StatusOptions = Object.values(missionStatusLabels)
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
  const sourceOptions = Object.values(missionSourceEnum)
  const handleSetSourceFilter = value => {
    dispatch(setMissionSourceFilter(value))
  }
  const handleSetMissionStartedAfterFilter = (v: Date | undefined) => {
    dispatch(setMissionStartedAfter(v ? v.toISOString() : undefined))
  }
  const handleSetMissionStartedBeforeFilter = (v: Date | undefined) => {
    dispatch(setMissionStartedBefore(v ? v.toISOString() : undefined))
  }

  const handleResetFilters = () => {
    dispatch(resetMissionFilters())
  }

  return (
    <>
      <Title>FILTRER LA LISTE</Title>
      <FilterWrapper ref={unitPickerRef}>
        <DatePicker
          key={JSON.stringify({ missionStartedAfter })}
          baseContainer={newWindowContainerRef.current}
          data-cy="datepicker-missionStartedAfter"
          defaultValue={missionStartedAfter}
          label="Date de début après le"
          onChange={handleSetMissionStartedAfterFilter}
        />
        <DatePicker
          key={JSON.stringify({ missionStartedBefore })}
          baseContainer={newWindowContainerRef.current}
          data-cy="datepicker-missionStartedBefore"
          defaultValue={missionStartedBefore}
          label="Date de début avant le"
          onChange={handleSetMissionStartedBeforeFilter}
          style={{ marginLeft: '10px' }}
        />
        <StyledSelect
          baseContainer={newWindowContainerRef.current}
          isLabelHidden
          label="Origine"
          name="origine"
          onChange={handleSetSourceFilter}
          options={sourceOptions}
          placeholder="Origine"
          style={tagPickerStyle}
          value={missionSourceFilter}
        />
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
          isLabelHidden
          label="Administrations"
          name="administrations"
          onChange={handleSetAdministrationFilter}
          options={administrationListAsOptions}
          placeholder="Administrations"
          searchable
          style={largeTagPickerStyle}
          value={missionAdministrationFilter}
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
          searchable
          style={largeTagPickerStyle}
          value={missionUnitFilter}
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
  flex-wrap: wrap;
  align-items: end;
  gap: 10px;
`
const AdvancedFiltersButton = styled.span`
  display: none;
  text-decoration: underline;
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

const AdvancedFiltersWrapper = styled.div`
  display: flex;
`
const Separator = styled.div`
  flex: 1;
`
const tagPickerStyle = { width: 160 }
const largeTagPickerStyle = { width: 260 }

const StyledSelect = styled(Select)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`
