import React from 'react'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconButton } from 'rsuite'

import { actionTargetTypeEnum, actionTypeEnum } from '../../../domain/entities/missions'

import { ReactComponent as DuplicateSVG } from '../../../uiMonitor/icons/dupliquer_14px.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'
import { ReactComponent as ControlIconSVG } from '../../../uiMonitor/icons/controles.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../../uiMonitor/icons/surveillance_18px.svg'
import { ReactComponent as NoteSVG } from '../../../uiMonitor/icons/note_libre.svg'

import { COLORS } from '../../../constants/constants'

export const ActionCard = ({selected, selectAction, action, removeAction, duplicateAction}) => {

 
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
    <ActionSummaryWrapper selected={selected} $type={action.actionType}>
      
      {(action.actionType === actionTypeEnum.CONTROL.code) && (<>
        <ControlIcon />
        <SummaryContent>
          <Title>
            Contrôles {action.actionTheme ? 
              <Accented>{`${action.actionTheme} ${action.actionSubTheme ? ' - ' + action.actionSubTheme : ''}`}</Accented> 
              : 'à renseigner'}
          </Title>
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
      </>)}
      {(action.actionType === actionTypeEnum.SURVEILLANCE.code) && (<>
        <SurveillanceIcon /> 
        <SummaryContent>
          <Title>
            Surveillance {action.actionTheme ? 
              <Accented>{`${action.actionTheme} ${action.actionSubTheme ? ' - ' + action.actionSubTheme : ''}`}</Accented> 
              : 'à renseigner'}
          </Title>
          <ControlSummary>
          {
          action.duration &&
            <>
            <Accented>{action.duration} heures&nbsp;</Accented>
              de surveillance
            </>
          }
          </ControlSummary>
        </SummaryContent>
      </>)}
      
      {(action.actionType === actionTypeEnum.NOTE.code) && (
        <>
          <NoteIcon /> 
          <NoteContent>
            {action.observations || 'Observation à renseigner'} 
          </NoteContent>
        </>)}
      
        <ButtonsWrapper>
          <IconButton appearance='subtle' icon={<DuplicateSVG className='rs-icon' />} size="sm" title={"dupliquer"} onClick={duplicateAction} />
          <IconButton appearance='subtle' icon={<DeleteIcon className='rs-icon' />} size="sm" title={"supprimer"} onClick={removeAction} />
        </ButtonsWrapper>
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
  width: 50px;
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
  display: flex;
  flex: 1;
  border: ${props => props.selected ? `3px solid ${COLORS.steelBlue}` : `1px solid ${COLORS.lightGray}`};
  background: ${props => props.$type === actionTypeEnum.CONTROL.code ? 
    COLORS.white : props.$type === actionTypeEnum.SURVEILLANCE.code ? 
    COLORS.gainsboro : COLORS.steelBlue25};
  padding: ${props => props.selected ? `4px` : '6px'};
  margin-left: auto;
`

const Title = styled.span`
  font: normal normal normal 14px/20px Marianne;
`
const ControlIcon = styled(ControlIconSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 18px;
  margin-left: 18px;
  margin-right: 8px;
`
const SurveillanceIcon = styled(SurveillanceIconSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 18px;
  margin-left: 18px;
  margin-right: 8px;
`

const NoteIcon = styled(NoteSVG)`
  color: ${COLORS.gunMetal};
  width: 16px;
  height: 16px;
  margin-top: 18px;
  margin-left: 18px;
  margin-right: 8px;
  flex: 0 0 18px;
`
const ControlSummary = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${COLORS.slateGray};
`

const SummaryContent = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
  color: ${COLORS.gunMetal};
`

const NoteContent = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
  max-height: 54px;
  overflow: hidden;
  font: normal normal normal 14px/20px Marianne;
  color: ${COLORS.gunMetal};
`

const ButtonsWrapper = styled.div`
    width: 44px;
    margin-top: 12px;
    margin-left: auto;
`

const Accented = styled.span`
  font-weight: bold;
`

const Tags = styled.div`
  display: flex;
  margin-top: 16px;
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
