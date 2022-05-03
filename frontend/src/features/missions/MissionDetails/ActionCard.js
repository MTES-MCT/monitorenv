import React from 'react'
import styled from 'styled-components'

import { ReactComponent as ControlIconSVG } from '../../icons/Gyrophare_controles_gris.svg'
import { ReactComponent as SurveillanceIconSVG } from '../../icons/eye.svg'
import { COLORS } from '../../../constants/constants'
import { ActionTypeEnum } from '../../../domain/entities/missions'


export const ActionCard = ({selected, selectAction, action}) => {
  return (
  <Action onClick={selectAction}>
    <TimeLine>
      <Date>{action.actionStartDatetimeUtc}</Date>
      <Time>{action.actionStartDatetimeUtc}</Time>
      <Date>{action.actionEndDatetimeUtc}</Date>
      <Time>{action.actionEndDatetimeUtc}</Time>
    </TimeLine>
    <SummaryWrapper selected={selected} >
      {(action.actionType === ActionTypeEnum.CONTROL) && (<>
        <ControlIcon />
        Contrôles {action.actionTheme}
        <ControlSummary>
          {`${action.actionNumberOfControls} contrôles réalisés sur des cibles de type ${action.actionTargetType}` }
        </ControlSummary>
      </>)}
      {(action.actionType === ActionTypeEnum.SURVEILLANCE) && (<>
        <SurveillanceIcon /> Surveillance {action.actionTheme}
      </>)}
    </SummaryWrapper>
  </Action>)
}

const Action = styled.div`
  display: flex;
`
const TimeLine = styled.div``
const Date = styled.div``
const Time = styled.div``
const SummaryWrapper = styled.div`
  border: ${props => props.selected ? `3px solid ${COLORS.charcoal}` : ''};
  background: ${COLORS.white};
  padding: 16px;
`

const ControlIcon = styled(ControlIconSVG)`
  width: 16px;
  height: 16px;
`
const SurveillanceIcon = styled(SurveillanceIconSVG)`
  width: 16px;
  height: 16px;
`
const ControlSummary = styled.div`
`
