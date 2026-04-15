import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { missionStatusLabels } from '../../../domain/entities/missions'

export function MissionStatusLabel({ missionStatus }) {
  switch (missionStatus) {
    case missionStatusLabels.PENDING.code:
      return (
        <StatusWrapper>
          <Icon.Clock color={missionStatusLabels.PENDING.color} />
          {missionStatusLabels.PENDING.libelle}
        </StatusWrapper>
      )
    case missionStatusLabels.ENDED.code:
      return (
        <StatusWrapper>
          <Icon.Confirm color={missionStatusLabels.ENDED.color} />
          {missionStatusLabels.ENDED.libelle}
        </StatusWrapper>
      )

    case missionStatusLabels.UPCOMING.code:
      return (
        <StatusWrapper>
          <Icon.ClockDashed color={missionStatusLabels.UPCOMING.color} />
          {missionStatusLabels.UPCOMING.libelle}
        </StatusWrapper>
      )

    default:
      return null
  }
}

const StatusWrapper = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.white};
  border-radius: 999px;
  display: flex;
  font-weight: 500;
  padding: 0 4px 0 2px;

  svg {
    margin-right: 6px;
  }
`
