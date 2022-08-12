import React from 'react'
import styled from 'styled-components'
import { Dropdown } from 'rsuite';

import { actionFactory } from '../Missions.helpers'
import { actionTypeEnum } from '../../../domain/entities/missions'
import { ActionCard } from './ActionCard'

import { ReactComponent as PlusSVG } from '../../icons/plus.svg'
import { ReactComponent as ControlSVG } from '../../icons/controles.svg'
import { ReactComponent as SurveillanceSVG } from '../../icons/surveillance_18px.svg'
import { ReactComponent as NoteSVG } from '../../icons/note_libre.svg'
import { COLORS } from '../../../constants/constants';

export const ActionsForm = ({  push, remove, form, currentActionIndex, setCurrentActionIndex }) =>  {
  const handleAddSurveillanceAction = () => push(actionFactory({actionType: actionTypeEnum.SURVEILLANCE.code}))
  const handleAddControlAction = () => push(actionFactory({actionType: actionTypeEnum.CONTROL.code}))
  const handleAddNoteAction = () => push(actionFactory({actionType: actionTypeEnum.NOTE.code}))
  const handleSelectAction = index => () => setCurrentActionIndex(index)
  const handleRemoveAction = index => (e) => {
    e.stopPropagation()
    setCurrentActionIndex(null)
    remove(index)
  }
  const handleDuplicateAction = index => () => push(actionFactory(form.values.envActions[index]))

  return (<FormWrapper>
    <TitleWrapper>
      <Title>Actions réalisées en mission</Title>
        <Dropdown appearance='primary' size='sm' title={'Ajouter'} noCaret icon={<PlusSVG/>}>
          <Dropdown.Item icon={<ControlSVGIcon/>} onClick={handleAddControlAction}>
            Ajouter des contrôles
          </Dropdown.Item>
          <Dropdown.Item icon={<SurveillanceSVGIcon/>} onClick={handleAddSurveillanceAction}>
            Ajouter une surveillance
          </Dropdown.Item>
          <Dropdown.Item icon={<NoteSVGIcon/>} onClick={handleAddNoteAction}>
            Ajouter une note libre
          </Dropdown.Item>
        </Dropdown>
    </TitleWrapper>
    <ActionsTimeline>
    {form?.values.envActions?.length > 0 ? 
      form.values.envActions.map((action, index) => {
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
  font-style: italic;
`
const ControlSVGIcon = styled(ControlSVG)`
    width: 18px;
    margin-right: 10px;
    padding: 2px;
`
const SurveillanceSVGIcon = styled(SurveillanceSVG)`
    margin-right: 10px;
`
const NoteSVGIcon = styled(NoteSVG)`
  margin-right: 10px;
`