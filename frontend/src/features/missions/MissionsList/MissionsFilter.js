import React, { useState } from 'react'
import { CheckPicker } from 'rsuite'
import styled from 'styled-components'

export const MissionsFilter = () => {
  const [displayAdvancedFilters, setDisplayAdvancedFilters] = useState(false)
  return (<>
    <Title>FILTRER LA LISTE</Title>
    <FilterWrapper>
      <CheckPicker placeholder={'Unité'} data={['A', 'B']} />
      <CheckPicker placeholder={'Administration'} data={['A', 'B']} />
      <CheckPicker placeholder={'Façade'} data={['A', 'B']} />
      <CheckPicker placeholder={'Thématique'} data={['A', 'B']} />
      <AdvancedFiltersButton onClick={()=> setDisplayAdvancedFilters(!displayAdvancedFilters)}>{displayAdvancedFilters ? 'Masquer les critères avancés' : 'Voir plus de critères'} </AdvancedFiltersButton>
    </FilterWrapper>
    {displayAdvancedFilters && 
      <AdvancedFiltersWrapper>
        <CheckPicker placeholder={'Statut'} data={['A', 'B']} />
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