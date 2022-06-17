import React from 'react'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import styled from 'styled-components'

import { ReactComponent as ControlIconSVG } from '../../icons/Gyrophare_controles_gris.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../icons/eye.svg'

import { COLORS } from '../../../constants/constants'
import { ActionTypeEnum } from '../../../domain/entities/missions'
import { DeleteButton, DuplicateButton } from '../../commonStyles/Buttons.style'


export const ActionCard = ({selected, selectAction, action, removeAction}) => {
  const parsedActionStartDatetimeUtc = new Date(action.actionStartDatetimeWrapperUtc)
  const parsedActionEndDatetimeUtc = new Date(action.actionStartDatetimeUtc)
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
    <ActionSummaryWrapper selected={selected} >
      <ButtonsWrapper>
        
        
        <Duplicate />
        <DeleteButton onClick={removeAction} />
      
      </ButtonsWrapper>
      {(action.actionType === ActionTypeEnum.CONTROL) && (<SummaryWrapper>
        <ControlIcon />
        <SummaryContent>
          <Title>Contrôles {action.actionTheme}</Title>
          <ControlSummary>
          <Accented>{action.actionNumberOfControls || 0}</Accented>{` contrôles réalisés sur des cibles de type ` }<Accented>{action.actionTargetType|| 'non spécifié'}</Accented>
          </ControlSummary>
          <Tags>
            <Tag>RAS</Tag>
            <Tag>INFA</Tag>
            <Tag>INFRA SANS PV</Tag>
            <Tag>MED</Tag>
          </Tags>
        </SummaryContent>
      </SummaryWrapper>)}
      {(action.actionType === ActionTypeEnum.SURVEILLANCE) && (<>
        <SurveillanceIcon /> Surveillance {action.actionTheme}
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
  background: ${COLORS.white};
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