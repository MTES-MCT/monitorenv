import { Accent, Icon, Tag, THEME } from '@mtes-mct/monitor-ui'

import { Mission } from '../../mission.type'

export function MissionStatusTag({ status }: { status: string }) {
  switch (status) {
    case Mission.missionStatusLabels.PENDING.code:
      return (
        <Tag
          accent={Accent.PRIMARY}
          color={THEME.color.charcoal}
          data-cy="mission-status-tag-pending"
          Icon={Icon.Clock}
          iconColor={THEME.color.blueGray}
          withCircleIcon
        >
          {Mission.missionStatusLabels.PENDING.libelle}
        </Tag>
      )
    case Mission.missionStatusLabels.ENDED.code:
      return (
        <Tag
          accent={Accent.PRIMARY}
          data-cy="mission-status-tag-ended"
          Icon={Icon.Confirm}
          iconColor={THEME.color.charcoal}
          withCircleIcon
        >
          {Mission.missionStatusLabels.ENDED.libelle}
        </Tag>
      )

    case Mission.missionStatusLabels.UPCOMING.code:
      return (
        <Tag
          accent={Accent.PRIMARY}
          data-cy="mission-status-tag-upcoming"
          Icon={Icon.ClockDashed}
          iconColor={THEME.color.mayaBlue}
          withCircleIcon
        >
          {Mission.missionStatusLabels.UPCOMING.libelle}
        </Tag>
      )

    default:
      return null
  }
}
