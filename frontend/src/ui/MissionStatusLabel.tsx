import styled from 'styled-components'

import { missionStatusLabels } from '../domain/entities/missions'
import { ReactComponent as CercleSVG } from '../uiMonitor/icons/Cercle.svg'
import { ReactComponent as CheckSVG } from '../uiMonitor/icons/Check.svg'

export function MissionStatusLabel({ missionStatus }) {
  switch (missionStatus) {
    case missionStatusLabels.PENDING.code:
      return (
        <StatusWrapper color={missionStatusLabels.PENDING.color}>
          <CercleSVG />
          {missionStatusLabels.PENDING.libelle}
        </StatusWrapper>
      )
    case missionStatusLabels.ENDED.code:
      return (
        <StatusWrapper color={missionStatusLabels.ENDED.color}>
          <CercleSVG />
          {missionStatusLabels.ENDED.libelle}
        </StatusWrapper>
      )

    case missionStatusLabels.CLOSED.code:
      return (
        <StatusWrapper color={missionStatusLabels.CLOSED.color}>
          <CheckSVG />
          {missionStatusLabels.CLOSED.libelle}
        </StatusWrapper>
      )
    case missionStatusLabels.UPCOMING.code:
      return (
        <StatusWrapper color={missionStatusLabels.UPCOMING.color}>
          <CercleSVG />
          {missionStatusLabels.UPCOMING.libelle}
        </StatusWrapper>
      )

    default:
      return <StatusWrapper color={missionStatusLabels.CLOSED.color}>No status</StatusWrapper>
  }
}

const StatusWrapper = styled.div<{ color: string }>`
  color: ${p => p.color};
  font-weight: 500;
  display: flex;
  align-items: center;
  svg {
    margin-right: 6px;
  }
`
