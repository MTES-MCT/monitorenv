import { Accent, Icon, Tag, THEME } from '@mtes-mct/monitor-ui'

import { missionStatusLabels } from '../../../domain/entities/missions'

export function MissionStatusTag({ status }: { status: string }) {
  switch (status) {
    case missionStatusLabels.PENDING.code:
      return (
        <Tag
          accent={Accent.PRIMARY}
          color={THEME.color.charcoal}
          data-cy="mission-status-tag-pending"
          Icon={Icon.Clock}
          iconColor={THEME.color.blueGray}
          withCircleIcon
        >
          {missionStatusLabels.PENDING.libelle}
        </Tag>
      )
    case missionStatusLabels.ENDED.code:
      return (
        <Tag
          accent={Accent.PRIMARY}
          data-cy="mission-status-tag-ended"
          Icon={Icon.Confirm}
          iconColor={THEME.color.charcoal}
          withCircleIcon
        >
          {missionStatusLabels.ENDED.libelle}
        </Tag>
      )

    case missionStatusLabels.UPCOMING.code:
      return (
        <Tag
          accent={Accent.PRIMARY}
          data-cy="mission-status-tag-upcoming"
          Icon={Icon.ClockDashed}
          iconColor={THEME.color.mayaBlue}
          withCircleIcon
        >
          {missionStatusLabels.UPCOMING.libelle}
        </Tag>
      )

    default:
      return null
  }
}
