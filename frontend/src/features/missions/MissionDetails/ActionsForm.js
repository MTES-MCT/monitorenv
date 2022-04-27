import React from 'react'
import styled from 'styled-components'

import { PrimaryButton } from '../../commonStyles/Buttons.style'
import { actionFactory } from '../Missions.helpers'
import { COLORS } from '../../../constants/constants'

export const ActionsForm = ({  push, form, actionIndex, setCurrentActionIndex }) =>  {
  const handleAddAction = () => push(actionFactory())

  return (<>
    <h3>Actions réalisées en mission</h3>
    <PrimaryButton
      type="button"
      onClick={handleAddAction}
    >
      + Ajouter
    </PrimaryButton>
    {form?.values.actions.length > 0 ? 
      form?.values.actions.map((action, index) => {
        console.log('action', action)
        return (
        <Action selected={index === actionIndex} key={index} onClick={()=>setCurrentActionIndex(index)}>
          Action {index}
        </Action>
      )})
    : <NoAction>Aucune action n&apos;est ajoutée pour le moment</NoAction>
  }
    
  </>
)}

const Action = styled.div`
  border: ${props => props.selected ? `2px solid ${COLORS.charcoal}` : ''}
`

const NoAction = styled.div`
  text-align: center;
`
