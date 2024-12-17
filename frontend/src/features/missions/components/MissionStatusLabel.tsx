import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { missionStatusLabels } from '../../../domain/entities/missions'

export function MissionStatusLabel({ missionStatus }) {
  switch (missionStatus) {
    case missionStatusLabels.PENDING.code:
      return (
        <StatusWrapper $color={missionStatusLabels.PENDING.color}>
          <Icon.Clock color={missionStatusLabels.PENDING.color} />
          {missionStatusLabels.PENDING.libelle}
        </StatusWrapper>
      )
    case missionStatusLabels.ENDED.code:
      return (
        <StatusWrapper $color={missionStatusLabels.ENDED.color}>
          <Icon.Confirm color={missionStatusLabels.ENDED.color} />
          {missionStatusLabels.ENDED.libelle}
        </StatusWrapper>
      )

    case missionStatusLabels.UPCOMING.code:
      return (
        <StatusWrapper $color={missionStatusLabels.UPCOMING.color}>
          <Icon.ClockDashed color={missionStatusLabels.UPCOMING.color} />
          {missionStatusLabels.UPCOMING.libelle}
        </StatusWrapper>
      )

    default:
      return null
  }
}
const StatusWrapper = styled.div<{ $color: string }>`
  color: ${p => p.$color};
  font-weight: 500;
  display: flex;
  align-items: center;
  svg {
    margin-right: 6px;
  }
`
