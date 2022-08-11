import React from 'react'
import styled from 'styled-components'
import { Button } from 'rsuite'

import { resourceUnitFactory } from '../Missions.helpers'

import { COLORS } from '../../../constants/constants'
import { ResourceUnitSelector } from './ResourceUnitSelector'

export const ResourceUnitsForm = ({  push, remove, form }) =>  {

  const handleAddResourceUnit = () => {
    push(resourceUnitFactory())
  }
  const handleRemoveResourceUnit = (index) => () => {
    remove(index)
  }

  return (<>
    {form?.values.resourceUnits?.length > 0  ? 
    <ResourceUnitsWrapper>
      {form?.values.resourceUnits?.map((resourceUnit, index) => {
        return (
          <ResourceUnitSelector
            key={index}
            resourceUnitPath={`resourceUnits[${index}]`}
            removeResourceUnit={handleRemoveResourceUnit(index)}
            resourceUnitIndex={index}
            /> 
      )})}
    </ResourceUnitsWrapper>
    : <NoActionWrapper><NoAction>Aucune unité renseignée</NoAction></NoActionWrapper>
  }

    <Button
      appearance='ghost'
      size='sm'
      onClick={handleAddResourceUnit}
    >
      + Ajouter une nouvelle unité
    </Button>
    
  </>
)}

const ResourceUnitsWrapper = styled.div`
  flex: 1;
`
const NoActionWrapper = styled.div`
  background: ${COLORS.white};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NoAction = styled.div`
  text-align: center;
`