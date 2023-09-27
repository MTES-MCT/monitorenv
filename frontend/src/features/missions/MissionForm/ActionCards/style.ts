import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ActionTypeEnum } from '../../../../domain/entities/missions'

export const Card = styled.div`
  flex: 1;
`

export const Action = styled.div`
  display: flex;
`
export const TimeLine = styled.div`
  display: flex;
  width: 54px;
  margin-right: 16px;
  font-size: 13px;
  flex-direction: column;
  justify-content: center;
`

export const ActionSummaryWrapper = styled.div<{ $hasError: boolean; $selected: boolean; $type?: string }>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  border-color: ${p =>
    // eslint-disable-next-line no-nested-ternary
    p.$hasError
      ? `${p.theme.color.maximumRed}`
      : p.$selected
      ? `${p.theme.color.blueGray}`
      : `${p.theme.color.lightGray}`};
  border-size: ${p => (p.$selected ? `3px` : `1px`)};
  border-style: solid;
  padding: 16px;
  background: ${p => {
    switch (p.$type) {
      case ActionTypeEnum.CONTROL:
        return p.theme.color.white
      case ActionTypeEnum.SURVEILLANCE:
        return p.theme.color.gainsboro
      case ActionTypeEnum.NOTE:
        return p.theme.color.blueYonder25
      case ActionTypeEnum.REPORTING:
        // TODO : add color in monitor-ui
        return p.theme.color.maximumRed15
      default:
        return p.theme.color.white
    }
  }};
`

export const TitleAndButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  padding-right: 52px;
`
export const Title = styled.span`
  font: normal normal normal 14px/20px Marianne;
`

export const ControlSummary = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${p => p.theme.color.slateGray};
  margin-bottom: 16px;
`

export const SummaryContent = styled.div`
  flex: 1;
  color: ${p => p.theme.color.gunMetal};
`

export const NoteContent = styled.div`
  color: ${p => p.theme.color.gunMetal};
  font: normal normal normal 14px/20px Marianne;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  flex: 1;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: baseline;
  > button {
    padding: 0px;
  }
`

export const Accented = styled.span`
  font-weight: bold;
`

export const DeleteIcon = styled(Icon.Delete)`
  color: ${p => p.theme.color.maximumRed};
`
export const DurationWrapper = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${p => p.theme.color.slateGray};
`

export const ReportingDate = styled.p`
  color: ${p => p.theme.color.slateGray};
  padding-bottom: 8px;
`
