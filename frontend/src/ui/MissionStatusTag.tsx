import { Accent, Icon, Tag, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { missionStatusLabels } from '../domain/entities/missions'

export function MissionStatusTag({ status }: { status: string }) {
  switch (status) {
    case missionStatusLabels.PENDING.code:
      return (
        <StatusTag
          accent={Accent.PRIMARY}
          color={THEME.color.charcoal}
          Icon={Icon.Clock}
          iconColor={THEME.color.blueGray}
        >
          {missionStatusLabels.PENDING.libelle}
        </StatusTag>
      )
    case missionStatusLabels.ENDED.code:
      return (
        <StatusTag accent={Accent.PRIMARY} Icon={Icon.Confirm} iconColor={THEME.color.charcoal}>
          {missionStatusLabels.ENDED.libelle}
        </StatusTag>
      )

    case missionStatusLabels.UPCOMING.code:
      return (
        <StatusTag accent={Accent.PRIMARY} Icon={Icon.Clock} iconColor={THEME.color.blueNcs}>
          {missionStatusLabels.UPCOMING.libelle}
        </StatusTag>
      )

    default:
      return null
  }
}

const StatusTag = styled(Tag)`
  align-self: end;
  padding: 1px 8px 3px 3px;
`
