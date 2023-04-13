import { Option, Select, DatePicker } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { MutableRefObject, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { useGetControlUnitsQuery } from '../../../api/controlUnitsAPI'
import { missionSourceEnum, missionStatusLabels, missionTypeEnum } from '../../../domain/entities/missions'
import { resetMissionFilters, updateFilters } from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useNewWindow } from '../../../ui/NewWindow'
import { ReactComponent as ReloadSVG } from '../../../uiMonitor/icons/Reload.svg'

export function MissionsTableFilters() {
  const dispatch = useDispatch()
  const { newWindowContainerRef } = useNewWindow()
  const { administrationFilter, sourceFilter, startedAfter, startedBefore, statusFilter, typeFilter, unitFilter } =
    useAppSelector(state => state.missionFilters)

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
        <DatePicker
          key={JSON.stringify({ startedAfter })}
          baseContainer={newWindowContainerRef.current}
          data-cy="datepicker-missionStartedAfter"
          defaultValue={startedAfter}
          label="Date de début après le"
          onChange={handleSetMissionStartedAfterFilter}
        />
        <DatePicker
          key={JSON.stringify({ startedBefore })}
          baseContainer={newWindowContainerRef.current}
          data-cy="datepicker-missionStartedBefore"
          defaultValue={startedBefore}
          label="Date de début avant le"
          onChange={handleSetMissionStartedBeforeFilter}
          style={{ marginLeft: '10px' }}
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
          searchable={false}
          size="sm"
          style={tagPickerStyle}
          value={statusFilter}
          valueKey="code"
        />
        <AdvancedFiltersButton onClick={handleDisplayAdvancedFilters}>
          {displayAdvancedFilters ? 'Masquer les critères avancés' : 'Voir plus de critères'}
        </AdvancedFiltersButton>
        <Separator />

        {!_.isEmpty(
          [...statusFilter, ...typeFilter, startedAfter, startedBefore, administrationFilter, unitFilter].filter(v => v)
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
const StyledCheckPicker = styled(CheckPicker)`
  .rs-picker-toggle-placeholder {
    font-size: 13px !important;
  }
`
