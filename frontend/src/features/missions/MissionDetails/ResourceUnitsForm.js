import React from 'react'
import styled from 'styled-components'
import { IconButton } from 'rsuite'

import { resourceUnitFactory } from '../Missions.helpers'

import { ResourceUnitSelector } from './ResourceUnitSelector'

import { ReactComponent as PlusSVG } from '../../../uiMonitor/icons/plus.svg'

import { COLORS } from '../../../constants/constants'

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

    <IconButton
      appearance='ghost'
      size='sm'
      icon={<PlusSVG className="rs-icon"/>}
      onClick={handleAddResourceUnit}
    >
      Ajouter une unité
    </IconButton>
    
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