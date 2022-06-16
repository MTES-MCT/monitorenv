import React from 'react'
import styled from 'styled-components'

import { PrimaryButton } from '../../commonStyles/Buttons.style'
import { actionFactory } from '../Missions.helpers'
import { ActionTypeEnum } from '../../../domain/entities/missions'
import { ActionCard } from './ActionCard'

import { COLORS } from '../../../constants/constants';

export const ActionsForm = ({  push, remove, form, currentActionIndex, setCurrentActionIndex }) =>  {
  const handleAddSurveillanceAction = () => push(actionFactory(ActionTypeEnum.SURVEILLANCE))
  const handleAddControlAction = () => push(actionFactory(ActionTypeEnum.CONTROL))
  const handleSelectAction = index => () => setCurrentActionIndex(index)
  const handleRemoveAction = index => (e) => {
    e.stopPropagation()
    setCurrentActionIndex(null)
    remove(index)
  }

  return (<FormWrapper>
    <TitleWrapper>
      <Title>Actions réalisées en mission</Title>
      <AddActionButtons>
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
      </AddActionButtons>
    </TitleWrapper>
    <ActionsTimeline>
    {form?.values.actions.length > 0 ? 
      form?.values.actions.map((action, index) => {
        return (
        <ActionCard selected={index === currentActionIndex} key={index} selectAction={handleSelectAction(index)} action={action} removeAction={handleRemoveAction(index)}/>
      )})
      : <NoActionWrapper><NoAction>Aucune action n&apos;est ajoutée pour le moment</NoAction></NoActionWrapper>
    }
    </ActionsTimeline>
  </FormWrapper>
)}



const FormWrapper = styled.div`
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  padding-top: 32px;
  padding-right: 19px;
  color: ${COLORS.slateGray}
`
const TitleWrapper = styled.div`
  display: flex;
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  color: ${COLORS.charcoal}
`
const AddActionButtons = styled.div`
  display: flex;
  flex-direction: column;
`

const ActionsTimeline = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const NoActionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const NoAction = styled.div`
  text-align: center;
`
