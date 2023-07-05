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
      return <StatusTag bgColor={missionStatusLabels.CLOSED.color}>{missionStatusLabels.CLOSED.libelle}</StatusTag>

    case missionStatusLabels.UPCOMING.code:
      return <StatusTag bgColor={missionStatusLabels.UPCOMING.color}>{missionStatusLabels.UPCOMING.libelle}</StatusTag>

    default:
      return null
  }
}

const StatusTag = styled(Tag)<{
  bgColor: string
}>`
  align-self: end;
  color: ${p => p.theme.color.white};
  background-color: ${p => p.bgColor};
`
