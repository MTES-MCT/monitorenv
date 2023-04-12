import styled from 'styled-components'

import { COLORS } from '../constants/constants'
import { missionStatusEnum } from '../domain/entities/missions'
import { ReactComponent as CercleSVG } from '../uiMonitor/icons/Cercle.svg'
import { ReactComponent as CheckSVG } from '../uiMonitor/icons/Check.svg'

export function MissionStatusLabel({ missionStatus }) {
  switch (missionStatus) {
    case missionStatusEnum.PENDING.code:
      return (
        <StatusWrapper color={COLORS.mediumSeaGreen}>
          <CercleSVG />
          {missionStatusEnum.PENDING.libelle}
        </StatusWrapper>
      )
    case missionStatusEnum.ENDED.code:
      return (
        <StatusWrapper color={COLORS.charcoal}>
          <CercleSVG />
          {missionStatusEnum.ENDED.libelle}
        </StatusWrapper>
      )

    case missionStatusEnum.CLOSED.code:
      return (
        <StatusWrapper color={COLORS.opal}>
          <CheckSVG />
          {missionStatusEnum.CLOSED.libelle}
        </StatusWrapper>
      )
    case missionStatusEnum.UPCOMING.code:
      return (
        <StatusWrapper color={COLORS.blueGray}>
          <CercleSVG />
          {missionStatusEnum.UPCOMING.libelle}
        </StatusWrapper>
      )

    default:
      return <StatusWrapper color={COLORS.opal}>No status</StatusWrapper>
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
