import { Tag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { missionStatusLabels } from '../domain/entities/missions'

export function MissionStatusTag({ status }: { status: string }) {
  switch (status) {
    case missionStatusLabels.PENDING.code:
      return <StatusTag bgColor={missionStatusLabels.PENDING.color}>{missionStatusLabels.PENDING.libelle}</StatusTag>
    case missionStatusLabels.ENDED.code:
      return <StatusTag bgColor={missionStatusLabels.ENDED.color}>{missionStatusLabels.ENDED.libelle}</StatusTag>

    case missionStatusLabels.CLOSED.code:
      return (
        <StatusTag
          bgColor={missionStatusLabels.CLOSED.color}
          borderColor={missionStatusLabels.CLOSED.borderColor}
          grayText
        >
          {missionStatusLabels.CLOSED.libelle}
        </StatusTag>
      )

    case missionStatusLabels.UPCOMING.code:
      return <StatusTag bgColor={missionStatusLabels.UPCOMING.color}>{missionStatusLabels.UPCOMING.libelle}</StatusTag>

    default:
      return null
  }
}

const StatusTag = styled(Tag)<{
  bgColor: string
  borderColor?: string | undefined
  grayText?: boolean
}>`
  align-self: end;
  color: ${p => (p.grayText ? p.theme.color.slateGray : p.theme.color.white)};
  border: ${p => (p.borderColor ? `1px solid ${p.borderColor}` : '0px')};
  background-color: ${p => p.bgColor};
`
