import { TransparentButton } from '@components/style'
import { Icon, Tag } from '@mtes-mct/monitor-ui'
import { ReportingTypeEnum } from 'domain/entities/reporting'
import styled from 'styled-components'

import { ActionTypeEnum } from '../../../../../../domain/entities/missions'

export const Card = styled.div`
  flex: 1;
  position: relative;
`

export const Action = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`
export const TimeLine = styled.div<{ $isFishAction: boolean }>`
  background: ${p => p.theme.color.cultured};
  display: flex;
  margin: Opx 16px 0px 0px;
  font-size: 13px;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  width: 60px;
  padding: 16px 0px;
  z-index: 1;
  position: relative;
  ${p => p.$isFishAction && `padding-bottom: 20px;`}
`

const getBorderColor = p => {
  if (p.$hasError) {
    return p.theme.color.maximumRed
  }
  if (p.$selected) {
    return p.theme.color.blueGray
  }

  return p.theme.color.lightGray
}

const getBackgroundColor = p => {
  if (p.$reportingType === ReportingTypeEnum.OBSERVATION) {
    return p.theme.color.blueGray25
  }

  switch (p.$type) {
    case ActionTypeEnum.CONTROL:
      return p.theme.color.white
    case ActionTypeEnum.SURVEILLANCE:
      return p.theme.color.gainsboro
    case ActionTypeEnum.NOTE:
      return p.theme.color.blueYonder25
    case ActionTypeEnum.REPORTING:
      return p.theme.color.maximumRed15
    default:
      return p.theme.color.white
  }
}

export const ActionSummaryWrapper = styled(TransparentButton)<{
  $hasError?: boolean
  $reportingType?: ReportingTypeEnum
  $selected?: boolean
  $type?: string
}>`
  display: flex;
  justify-content: space-between;
  text-align: start;
  flex-direction: column;
  gap: 8px;
  border-color: ${p => getBorderColor(p)};
  border-size: ${p => (p.$selected ? `3px` : `1px`)};
  border-style: solid;
  padding: 16px;
  background: ${p => getBackgroundColor(p)} !important;
`

export const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 8px;
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
export const SummaryContentFirstPart = styled.div`
  display: flex;
  flex-direction: column;
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
  position: absolute;
  top: 16px;
  right: 16px;
`
export const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
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

export const ReportingDate = styled.span`
  color: ${p => p.theme.color.slateGray};
  padding-bottom: 8px;
`
export const StyledTag = styled(Tag)`
  background-color: ${p => p.theme.color.maximumRed15};
`

export const ControlContainer = styled.div<{ $isEndAlign: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${p => (p.$isEndAlign ? 'end' : 'start')};
  padding-top: 16px;
`
