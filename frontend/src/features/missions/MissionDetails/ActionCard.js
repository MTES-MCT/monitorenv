import React from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

import { useGetControlTopicsQuery } from '../../../api/controlTopicsAPI'

import { ReactComponent as ControlIconSVG } from '../../icons/Gyrophare_controles_gris.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../icons/eye.svg'

import { COLORS } from '../../../constants/constants'
import { ActionTypeEnum } from '../../../domain/entities/missions'
import { DeleteButton, DuplicateButton } from '../../commonStyles/Buttons.style'


export const ActionCard = ({selected, selectAction, action, removeAction}) => {

  const { controlTopics } = useGetControlTopicsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      controlTopics: _.find(data, r =>  action.actionTheme === r.id),
    }),
  })
  const parsedActionStartDatetimeUtc = new Date(action.actionStartDatetimeUtc)
  const parsedActionEndDatetimeUtc = new Date(action.actionEndDatetimeUtc)

  
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
      <DateTimeWrapper>
        {
          isValid(parsedActionEndDatetimeUtc) &&
            (<>
              <DateWrapper>{format(parsedActionEndDatetimeUtc, "dd MMM", {locale: fr})}</DateWrapper>
              <Time>à {format(parsedActionEndDatetimeUtc, "HH:mm", {locale: fr})}</Time>
            </>)
        }
      </DateTimeWrapper>
    </TimeLine>
    <ActionSummaryWrapper selected={selected} type={action.actionType}>
      <ButtonsWrapper>
        
        <Duplicate />
        <DeleteButton onClick={removeAction} />
      
      </ButtonsWrapper>
      {(action.actionType === ActionTypeEnum.CONTROL.code) && (<SummaryWrapper>
        <ControlIcon />
        <SummaryContent>
          <Title>Contrôles {`${controlTopics?.topic_level_1 || 'Non spécifié'} ${controlTopics?.topic_level_2 || ''} ${controlTopics?.topic_level_3 || ''}`}</Title>
          <ControlSummary>
          <Accented>{action.actionNumberOfControls || 0}</Accented>{` contrôles réalisés sur des cibles de type ` }<Accented>{action.actionTargetType|| 'non spécifié'}</Accented>
          </ControlSummary>
          <Tags>
            <Tag>RAS</Tag>
            <Tag>INFRA</Tag>
            <Tag>INFRA SANS PV</Tag>
            <Tag>MED</Tag>
          </Tags>
        </SummaryContent>
      </SummaryWrapper>)}
      {(action.actionType === ActionTypeEnum.SURVEILLANCE.code) && (<SummaryWrapper>
        <SurveillanceIcon /> 
        <SummaryContent>
          <Title>Surveillance {`${controlTopics?.topic_level_1 || 'Non spécifiée'} ${controlTopics?.topic_level_2 || ''} ${controlTopics?.topic_level_3 || ''}`}</Title>
          </SummaryContent>
      </SummaryWrapper>)}
      {(action.actionType === ActionTypeEnum.NOTE.code) && (<>
        <SurveillanceIcon /> {action.observations || 'Note libre'} 
      </>)}
      
    </ActionSummaryWrapper>
  </Action>)
}

const Action = styled.div`
  display: flex;
  margin-top: ${props => props.selected ? `1px` : '4px'};
  margin-bottom: ${props => props.selected ? `1px` : '4px'};
`
const TimeLine = styled.div`

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
  border: ${props => props.selected ? `3px solid ${COLORS.charcoal}` : ''};
  background: ${props => props.type === ActionTypeEnum.CONTROL.code ? COLORS.white : props.type === ActionTypeEnum.SURVEILLANCE.code ? COLORS.shadowBlueLittleOpacity : COLORS.missingGrey};
  padding: ${props => props.selected ? `4px` : '7px'};
  margin-left: 32px;
`

const Title = styled.span`
  font: normal normal normal 14px/20px Marianne;
`
const ControlIcon = styled(ControlIconSVG)`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`
const SurveillanceIcon = styled(SurveillanceIconSVG)`
  width: 16px;
  height: 16px;
`
const ControlSummary = styled.div`
  font: normal normal normal 13px/18px Marianne;
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
const Duplicate = styled(DuplicateButton)`
  margin-right: 6px;
`

const Accented = styled.span`
  font-weight: bold;
`

const Tags = styled.div`
  display: flex;
`

const Tag = styled.div`
  background: ${COLORS.missingGrey};
  margin-right: 4px;
  padding: 4px;
`