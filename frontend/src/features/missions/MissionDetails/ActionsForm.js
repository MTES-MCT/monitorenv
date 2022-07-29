import React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'rsuite';

import { actionFactory } from '../Missions.helpers'
import { ActionTypeEnum } from '../../../domain/entities/missions'
import { ActionCard } from './ActionCard'

import { COLORS } from '../../../constants/constants';

export const ActionsForm = ({  push, remove, form, currentActionIndex, setCurrentActionIndex }) =>  {
  const handleAddSurveillanceAction = () => push(actionFactory({actionType: ActionTypeEnum.SURVEILLANCE.code}))
  const handleAddControlAction = () => push(actionFactory({actionType: ActionTypeEnum.CONTROL.code}))
  const handleAddNoteAction = () => push(actionFactory({actionType: ActionTypeEnum.NOTE.code}))
  const handleSelectAction = index => () => setCurrentActionIndex(index)
  const handleRemoveAction = index => (e) => {
    e.stopPropagation()
    setCurrentActionIndex(null)
    remove(index)
  }
  const handleDuplicateAction = index => () => push(actionFactory(form.values.actions[index]))

  return (<FormWrapper>
    <TitleWrapper>
      <Title>Actions réalisées en mission</Title>
      <AddActionButtons>
        <Dropdown title={'+ Ajouter'} noCaret >
          <Dropdown.Item onClick={handleAddControlAction}>
            Ajouter des contrôles
          </Dropdown.Item>
          <Dropdown.Item onClick={handleAddSurveillanceAction}>
            Ajouter une surveillance
          </Dropdown.Item>
          <Dropdown.Item onClick={handleAddNoteAction}>
            Ajouter une note libre
          </Dropdown.Item>
        </Dropdown>
      </AddActionButtons>
    </TitleWrapper>
    <ActionsTimeline>
    {form?.values.actions.length > 0 ? 
      form.values.actions.map((action, index) => {
        return (
        <ActionCard 
          key={index} 
          selected={index === currentActionIndex} 
          selectAction={handleSelectAction(index)} 
          action={action} 
          removeAction={handleRemoveAction(index)}
          duplicateAction={handleDuplicateAction(index)}
        />
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
  color: ${COLORS.slateGray};
`
const TitleWrapper = styled.div`
`
const Title = styled.h2`
  font-size: 16px;
  line-height: 22px;
  color: ${COLORS.charcoal};
  display: inline-block;
  margin-right: 16px;
`
const AddActionButtons = styled.div`
  display: inline-block;
  padding: 8px 12px 8px 16px;
  color: ${COLORS.white};
  background: ${COLORS.charcoal};
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
