import React, { useState } from 'react'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

export const MissionsFilter = () => {
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false)
  return (<>
    <Title>FILTRER LA LISTE</Title>
    <FilterWrapper>
      
      <CheckPicker style={tagPickerStyle} placeholder={'Unité'} data={[{label: 'A', value: 'A'}, {label: 'B', value: 'B'}]} />
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

const AdvancedFiltersButton = styled.span`
  text-decoration: underline;
`
const AdvancedFiltersWrapper = styled.div`
display: flex;
`
const tagPickerStyle = { width: 160, margin: '2px 60px 10px 0', verticalAlign: 'top' }