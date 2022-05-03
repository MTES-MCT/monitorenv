import React from 'react'
import styled from 'styled-components'

import { PrimaryButton } from '../../commonStyles/Buttons.style'
import { actionFactory } from '../Missions.helpers'
import { ActionTypeEnum } from '../../../domain/entities/missions'
import { ActionCard } from './ActionCard'

export const ActionsForm = ({  push, form, actionIndex, setCurrentActionIndex }) =>  {
  const handleAddSurveillanceAction = () => push(actionFactory(ActionTypeEnum.SURVEILLANCE))
  const handleAddControlAction = () => push(actionFactory(ActionTypeEnum.CONTROL))
  const handleSelectAction = index => () => setCurrentActionIndex(index)

  return (<>
    <h3>Actions réalisées en mission</h3>
    <PrimaryButton
      type="button"
      onClick={handleAddControlAction}
    >
      + Ajouter un contrôle
    </PrimaryButton>
    <PrimaryButton
      type="button"
      onClick={handleAddSurveillanceAction}
    >
      + Ajouter une surveillance
    </PrimaryButton>
    {form?.values.actions.length > 0 ? 
      form?.values.actions.map((action, index) => {
        return (
        <ActionCard selected={index === actionIndex} key={index} selectAction={handleSelectAction(index)} action={action} />
      )})
    : <NoAction>Aucune action n&apos;est ajoutée pour le moment</NoAction>
  }
    
  </>
)}


const NoAction = styled.div`
  text-align: center;
`
