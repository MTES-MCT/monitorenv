import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

import { missionStatusEnum, missionTypeEnum, missionNatureEnum } from '../../../domain/entities/missions'
import { setMissionStatusFilter, setMissionNatureFilter, setMissionTypeFilter, resetMissionFilters } from '../../../domain/shared_slices/MissionFilters'

import ReloadIcon from '@rsuite/icons/Reload';
import _ from 'lodash'

export const MissionsTableFilters = () => {
  const dispatch = useDispatch()
  const {missionStatusFilter, missionNatureFilter, missionTypeFilter } = useSelector(state => state.missionFilters)
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false)

  const unitPickerRef = useRef()
  const handleDisplayAdvancedFilters = ()=> setDisplayAdvancedFilters(!displayAdvancedFilters)

  const StatusOptions = Object.values(missionStatusEnum)
  const handleSetStatusFilter = (v) => {
    dispatch(setMissionStatusFilter(v))
  }
  const TypeOptions = Object.values(missionTypeEnum)
  const handleSetTypeFilter = (v) => {
    dispatch(setMissionTypeFilter(v))
  }
  const NatureOptions = Object.values(missionNatureEnum)
  const handleSetNatureFilter = (v) => {
    dispatch(setMissionNatureFilter(v))
  }

  const handleResetFilters = () => {
    dispatch(resetMissionFilters())
  }
  return (<>
    <Title>FILTRER LA LISTE</Title>
    <FilterWrapper ref={unitPickerRef}>
      <CheckPicker
        size='sm'
        searchable={false}
        style={tagPickerStyle} 
        placeholder={'Statut'} 
        data={StatusOptions}
        labelKey='libelle'
        valueKey='code'
        container={()=>unitPickerRef.current}
        onChange={handleSetStatusFilter}
        value={missionStatusFilter}
        />
      <CheckPicker 
        size='sm'
        searchable={false}
        style={tagPickerStyle} 
        placeholder={'Type'} 
        data={TypeOptions} 
        labelKey='libelle'
        valueKey='code'
        container={()=>unitPickerRef.current}
        onChange={handleSetTypeFilter}
        value={missionTypeFilter}
        />
      <CheckPicker 
        size='sm'
        searchable={false}
        style={tagPickerStyle} 
        placeholder={'Nature'} 
        data={NatureOptions} 
        labelKey='libelle'
        valueKey='code'
        container={()=>unitPickerRef.current}
        onChange={handleSetNatureFilter}
        value={missionNatureFilter}
        />
      <AdvancedFiltersButton 
        onClick={handleDisplayAdvancedFilters}
        >
          {displayAdvancedFilters ? 'Masquer les critères avancés' : 'Voir plus de critères'} 
      </AdvancedFiltersButton>
      <Separator />

      {!_.isEmpty([...missionStatusFilter, ...missionNatureFilter,... missionTypeFilter]) &&
      <ResetFiltersButton onClick={handleResetFilters}>
        <ReloadIcon/>
        Réinitialiser les filtres
      </ResetFiltersButton>}
    </FilterWrapper>
    {displayAdvancedFilters && 
      <AdvancedFiltersWrapper>
        <CheckPicker 
          style={tagPickerStyle} 
          placeholder={'Facade'} 
          data={[{label: 'NAMO', value: 'NAMO'}, {label: 'MED', value: 'MED'}]} />
      </AdvancedFiltersWrapper>
    }
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
const tagPickerStyle = { width: 160, margin: '2px 10px 10px 0', verticalAlign: 'top' }