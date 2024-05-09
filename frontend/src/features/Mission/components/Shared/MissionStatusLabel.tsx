import { Mission } from '@features/Mission/mission.type'
import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function MissionStatusLabel({ missionStatus }) {
  switch (missionStatus) {
    case Mission.missionStatusLabels.PENDING.code:
      return (
        <StatusWrapper color={Mission.missionStatusLabels.PENDING.color}>
          <Icon.Clock color={Mission.missionStatusLabels.PENDING.color} />
          {Mission.missionStatusLabels.PENDING.libelle}
        </StatusWrapper>
      )
    case Mission.missionStatusLabels.ENDED.code:
      return (
        <StatusWrapper color={Mission.missionStatusLabels.ENDED.color}>
          <Icon.Confirm color={Mission.missionStatusLabels.ENDED.color} />
          {Mission.missionStatusLabels.ENDED.libelle}
        </StatusWrapper>
      )

    case Mission.missionStatusLabels.UPCOMING.code:
      return (
        <StatusWrapper color={Mission.missionStatusLabels.UPCOMING.color}>
          <Icon.ClockDashed color={Mission.missionStatusLabels.UPCOMING.color} />
          {Mission.missionStatusLabels.UPCOMING.libelle}
        </StatusWrapper>
      )

    default:
      return null
  }
}
const StatusWrapper = styled.div<{ color: string; smallMargin?: boolean }>`
  color: ${p => p.color};
  font-weight: 500;
  display: flex;
  align-items: center;
  svg {
    margin-right: 6px;
  }
`
