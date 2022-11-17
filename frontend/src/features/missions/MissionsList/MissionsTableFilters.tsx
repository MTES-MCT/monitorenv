import _ from 'lodash'
import { MutableRefObject, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CheckPicker, DatePicker } from 'rsuite'
import styled from 'styled-components'

import { missionStatusEnum, missionTypeEnum, missionNatureEnum } from '../../../domain/entities/missions'
import {
  setMissionStatusFilter,
  setMissionNatureFilter,
  setMissionTypeFilter,
  resetMissionFilters,
  setMissionStartedAfter,
  setMissionStartedBefore
} from '../../../domain/shared_slices/MissionFilters'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ReactComponent as ReloadSVG } from '../../../uiMonitor/icons/Reload.svg'

export function MissionsTableFilters() {
  const dispatch = useDispatch()
  const { missionNatureFilter, missionStartedAfter, missionStartedBefore, missionStatusFilter, missionTypeFilter } =
    useAppSelector(state => state.missionFilters)
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false)

  const unitPickerRef = useRef() as MutableRefObject<HTMLDivElement>
  const datepickerStartedAfterRef = useRef() as MutableRefObject<HTMLDivElement>
  const datepickerStartedBeforeRef = useRef() as MutableRefObject<HTMLDivElement>
  const handleDisplayAdvancedFilters = () => setDisplayAdvancedFilters(!displayAdvancedFilters)

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
  const missionStartedAfterDate = (missionStartedAfter && new Date(missionStartedAfter)) || undefined
  const missionStartedBeforeDate = (missionStartedBefore && new Date(missionStartedBefore)) || undefined

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
        <CheckPicker
          container={() => unitPickerRef.current}
          data={TypeOptions}
          labelKey="libelle"
          onChange={handleSetTypeFilter}
          placeholder="Type"
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
          placeholder="Nature"
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
            missionStartedBefore
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
