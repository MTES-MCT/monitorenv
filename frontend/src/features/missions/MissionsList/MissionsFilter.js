import React, { useRef, useState } from 'react'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

export const MissionsFilter = () => {
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false)

  const unitPickerRef = useRef()

  return (<>
    <Title>FILTRER LA LISTE</Title>
    <FilterWrapper ref={unitPickerRef}>
      <UnitPickerWrapper ref={unitPickerRef}>
        <CheckPicker container={()=>unitPickerRef.current} style={tagPickerStyle} placeholder={'Unité'} data={[{label: 'A', value: 'A'}, {label: 'B', value: 'B'}]} />
      </UnitPickerWrapper>
      <CheckPicker style={tagPickerStyle} placeholder={'Administration'} data={[{label: 'A', value: 'A'}, {label: 'B', value: 'B'}]} />
      <CheckPicker style={tagPickerStyle} placeholder={'Façade'} data={[{label: 'A', value: 'A'}, {label: 'B', value: 'B'}]} />
      <CheckPicker style={tagPickerStyle} placeholder={'Thématique'} data={[{label: 'A', value: 'A'}, {label: 'B', value: 'B'}]} />
      <AdvancedFiltersButton onClick={()=> setDisplayAdvancedFilters(!displayAdvancedFilters)}>{displayAdvancedFilters ? 'Masquer les critères avancés' : 'Voir plus de critères'} </AdvancedFiltersButton>
    </FilterWrapper>
    {displayAdvancedFilters && 
      <AdvancedFiltersWrapper>
        <CheckPicker style={tagPickerStyle} placeholder={'Statut'} data={[{label: 'A', value: 'A'}, {label: 'B', value: 'B'}]} />
      </AdvancedFiltersWrapper>
    }
  </>
  )
}

const Title = styled.h2`
`

const FilterWrapper = styled.div`
  display: flex;
`
const UnitPickerWrapper = styled.div``
const AdvancedFiltersButton = styled.span`
  text-decoration: underline;
`
const AdvancedFiltersWrapper = styled.div`
display: flex;
`
const tagPickerStyle = { width: 160, margin: '2px 60px 10px 0', verticalAlign: 'top' }