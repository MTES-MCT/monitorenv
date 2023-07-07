import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { missionStatusLabels } from '../domain/entities/missions'

export function MissionStatusLabel({ missionStatus }) {
  switch (missionStatus) {
    case missionStatusLabels.PENDING.code:
      return (
        <StatusWrapper color={missionStatusLabels.PENDING.color}>
          <StyledCircle color={missionStatusLabels.PENDING.color} />
          {missionStatusLabels.PENDING.libelle}
        </StatusWrapper>
      )
    case missionStatusLabels.ENDED.code:
      return (
        <StatusWrapper color={missionStatusLabels.ENDED.color}>
          <StyledCircle color={missionStatusLabels.ENDED.color} />
          {missionStatusLabels.ENDED.libelle}
        </StatusWrapper>
      )

    case missionStatusLabels.CLOSED.code:
      return (
        <StatusWrapper color={missionStatusLabels.CLOSED.borderColor} smallMargin>
          <Icon.Check size={16} />
          {missionStatusLabels.CLOSED.libelle}
        </StatusWrapper>
      )
    case missionStatusLabels.UPCOMING.code:
      return (
        <StatusWrapper color={missionStatusLabels.UPCOMING.color}>
          <StyledCircle color={missionStatusLabels.UPCOMING.color} />
          {missionStatusLabels.UPCOMING.libelle}
        </StatusWrapper>
      )

    default:
      return <StatusWrapper color={missionStatusLabels.CLOSED.borderColor}>No status</StatusWrapper>
  }
}

const StatusWrapper = styled.div<{ color: string; smallMargin?: boolean }>`
  color: ${p => p.color};
  font-weight: 500;
  display: flex;
  align-items: center;
  svg {
    margin-right: ${p => (p.smallMargin ? '2px' : '6px')};
    margin-left: ${p => (p.smallMargin ? '-2px' : '0px')};
  }
`
const StyledCircle = styled.div<{ color: string }>`
  height: 10px;
  width: 10px;
  margin-right: 6px;
  background-color: ${p => p.color};
  border-radius: 50%;
  display: inline-block;
`
