import ReloadIcon from '@rsuite/icons/Reload'
import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { missionStatusEnum, missionTypeEnum, missionNatureEnum } from '../../../domain/entities/missions'
import {
  setMissionStatusFilter,
  setMissionNatureFilter,
  setMissionTypeFilter,
  resetMissionFilters
} from '../../../domain/shared_slices/MissionFilters'

export function MissionsTableFilters() {
  const dispatch = useDispatch()
  const { missionNatureFilter, missionStatusFilter, missionTypeFilter } = useSelector(state => state.missionFilters)
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false)

  const unitPickerRef = useRef()
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

  const handleResetFilters = () => {
    dispatch(resetMissionFilters())
  }

  return (
    <>
      <Title>FILTRER LA LISTE</Title>
      <FilterWrapper ref={unitPickerRef}>
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

        {!_.isEmpty([...missionStatusFilter, ...missionNatureFilter, ...missionTypeFilter]) && (
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

const Title = styled.h2`
  font-size: 16px;
`

const FilterWrapper = styled.div`
  display: flex;
`
const AdvancedFiltersButton = styled.span`
  display: none;
  text-decoration: underline;
`

const ResetFiltersButton = styled.div`
  text-decoration: underline;
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
