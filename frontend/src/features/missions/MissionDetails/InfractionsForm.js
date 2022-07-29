import React, { useState } from 'react'
import styled from 'styled-components'

import { PrimaryButton } from '../../commonStyles/Buttons.style'
import { infractionFactory } from '../Missions.helpers'

import { COLORS } from '../../../constants/constants'
import { InfractionForm } from './InfractionForm'
import { InfractionCard } from './InfractionCard'

export const InfractionsForm = ({  push, remove, form, currentActionIndex }) =>  {
  
  const [ currentInfractionIndex, setCurrentInfractionIndex ] = useState(null)

  const handleAddInfraction = () => {
    const numberOfInfractions = form?.values.actions[currentActionIndex]?.infractions.length
    push(infractionFactory())
    setCurrentInfractionIndex(numberOfInfractions)
  }

  const handleValidate = () => {
    setCurrentInfractionIndex(null)
  }

  const handleEditInfraction = (index) => () => {
    setCurrentInfractionIndex(index)
  }

  const handleRemoveInfraction = (index) => () => {
    setCurrentInfractionIndex(null)
    remove(index)
  }

  return (<>
    <Header>
      <Title>Détailler une infraction d&apos;une cible</Title>
      <PrimaryButton
        type="button"
        onClick={handleAddInfraction}
      >
        + Ajouter une nouvelle infraction
      </PrimaryButton>
    </Header>
    
    {form?.values.actions.length > 0 && form?.values.actions[currentActionIndex]?.infractions.length > 0 ? 
    <InfractionsWrapper>
      {form?.values.actions[currentActionIndex]?.infractions.map((infraction, index) => {
        return (
          index === currentInfractionIndex ?
          <InfractionForm 
            key={infraction.id} 
            infractionPath={`actions[${currentActionIndex}].infractions[${index}]`} 
            setCurrentInfractionIndex={handleValidate} 
            currentActionIndex={currentActionIndex} 
            infractionIndex={index} 
            /> :
          <InfractionCard
            key={infraction.id}
            infractionPath={`actions[${currentActionIndex}].infractions[${index}]`}
            setCurrentInfractionIndex={handleEditInfraction(index)}
            removeInfraction={handleRemoveInfraction(index)}
            />
      )})}
    </InfractionsWrapper>
    : <NoActionWrapper><NoAction>Aucune infraction engregistrée pour le moment</NoAction></NoActionWrapper>
  }
    
  </>
)}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Title = styled.h3`
  font-size: 13px;
  line-height: 22px;
  display: inline-block;
  color: ${COLORS.slateGray}
`
const InfractionsWrapper = styled.div`
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