import React from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconButton } from 'rsuite'

import { useGetControlTopicsQuery } from '../../../api/controlTopicsAPI'

import { ReactComponent as DuplicateSVG } from '../../icons/dupliquer_14px.svg'
import { ReactComponent as DeleteSVG } from '../../icons/Suppression_clair.svg'
import { ReactComponent as ControlIconSVG } from '../../icons/controles.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../icons/surveillance_18px.svg'
import { ReactComponent as NoteSVG } from '../../icons/note_libre.svg'

import { COLORS } from '../../../constants/constants'
import { actionTargetTypeEnum, actionTypeEnum } from '../../../domain/entities/missions'

export const ActionCard = ({selected, selectAction, action, removeAction, duplicateAction}) => {

  const { controlTopics } = useGetControlTopicsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      controlTopics: _.find(data, r =>  action.actionTheme === r.id),
    }),
  })
  const parsedActionStartDatetimeUtc = new Date(action.actionStartDatetimeUtc)

  return (
  <Action onClick={selectAction}>
    <TimeLine>
      <DateTimeWrapper> 
        {
          isValid(parsedActionStartDatetimeUtc) && 
            (<>
              <DateWrapper>{format(parsedActionStartDatetimeUtc, "dd MMM", {locale: fr})}</DateWrapper>
              <Time>à {format(parsedActionStartDatetimeUtc, "HH:mm", {locale: fr})}</Time>
            </>)
        }
      </DateTimeWrapper>
    </TimeLine>
    <ActionSummaryWrapper selected={selected} type={action.actionType}>
      <ButtonsWrapper>
        
        <IconButton icon={<DuplicateSVG/>} size="sm" title={"dupliquer"} onClick={duplicateAction} />
        <IconButton icon={<DeleteIcon/>} size="sm" title={"supprimer"} onClick={removeAction} />
      
      </ButtonsWrapper>
      {(action.actionType === actionTypeEnum.CONTROL.code) && (<SummaryWrapper>
        <ControlIcon />
        <SummaryContent>
          <Title>Contrôles <Accented>{`${controlTopics?.topic_level_1 || 'Non spécifié'} ${controlTopics?.topic_level_2 || ''}`}</Accented></Title>
          <ControlSummary>
            <Accented>{action.actionNumberOfControls || 0}</Accented>
            {` contrôles réalisés sur des cibles de type ` }
            <Accented>{actionTargetTypeEnum[action.actionTargetType]?.libelle || 'non spécifié'}</Accented>
          </ControlSummary>
          <Tags>
            <Tag>RAS</Tag>
            <Tag>INFRA</Tag>
            <Tag>INFRA SANS PV</Tag>
            <Tag>MED</Tag>
          </Tags>
        </SummaryContent>
      </SummaryWrapper>)}
      {(action.actionType === actionTypeEnum.SURVEILLANCE.code) && (<SummaryWrapper>
        <SurveillanceIcon /> 
        <SummaryContent>
          <Title>Surveillance <Accented>{`${controlTopics?.topic_level_1 || 'Non spécifiée'} ${controlTopics?.topic_level_2 || ''}`}</Accented></Title>
          <ControlSummary>
            <Accented>{action.duration || 0} heures&nbsp;</Accented>
            de surveillance
          </ControlSummary>
          </SummaryContent>
      </SummaryWrapper>)}
      
      {(action.actionType === actionTypeEnum.NOTE.code) && (
        <SummaryWrapper>
          <NoteIcon /> 
          <NoteContent>
            {action.observations || 'Note libre'} 
          </NoteContent>
        </SummaryWrapper>)}
      
    </ActionSummaryWrapper>
  </Action>)
}

const Action = styled.div`
  display: flex;
  margin-top: ${props => props.selected ? `1px` : '4px'};
  margin-bottom: ${props => props.selected ? `1px` : '4px'};
`
const TimeLine = styled.div`
  display: flex;
  align-items: center;
`

const DateTimeWrapper = styled.div`
  margin-bottom: 4px;
  margin-top: 4px;
`
const DateWrapper = styled.div`
  font-weight: bold;
  font-size: 13px;
`
const Time = styled.div`
  font-size: 13px;
`
const ActionSummaryWrapper = styled.div`
  flex: 1;
  border: ${props => props.selected ? `3px solid ${COLORS.steelBlue}` : ''};
  background: ${props => props.type === actionTypeEnum.CONTROL.code ? 
    COLORS.white : props.type === actionTypeEnum.SURVEILLANCE.code ? 
    COLORS.gainsboro : COLORS.steelBlue25};
  padding: ${props => props.selected ? `4px` : '7px'};
  margin-left: 32px;
`

const Title = styled.span`
  font: normal normal normal 14px/20px Marianne;
`
const ControlIcon = styled(ControlIconSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-right: 8px;
`
const SurveillanceIcon = styled(SurveillanceIconSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-right: 8px;
`

const NoteIcon = styled(NoteSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex: 0 0 18px;
`
const ControlSummary = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${COLORS.slateGray};
`
const SummaryWrapper = styled.div`
  display: flex;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 8px;
`
const SummaryContent = styled.div`
  color: ${COLORS.charcoal};
`
const ButtonsWrapper = styled.div`
  float: right;
`

const Accented = styled.span`
  font-weight: bold;
`

const Tags = styled.div`
  display: flex;
  margin-top: 16px;
  margin-bottom: 16px;
`

const Tag = styled.div`
  background: ${COLORS.missingGrey};
  border-radius: 11px;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  padding: 2px 8px 2px 8px;
  :not(:first-child) {
    margin-left: 8px;
  }
`

const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`
const NoteContent = styled.div`
  max-height: 54px;
  overflow: hidden;
`
