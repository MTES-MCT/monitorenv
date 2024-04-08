import { Accent, Icon, Tag, THEME } from '@mtes-mct/monitor-ui'

import { missionStatusLabels } from '../domain/entities/missions'

export function MissionStatusTag({ status }: { status: string }) {
  switch (status) {
    case missionStatusLabels.PENDING.code:
      return (
        <Tag
          accent={Accent.PRIMARY}
          color={THEME.color.charcoal}
          Icon={Icon.Clock}
          iconColor={THEME.color.blueGray}
          withCircleIcon
        >
          {missionStatusLabels.PENDING.libelle}
        </Tag>
      )
    case missionStatusLabels.ENDED.code:
      return (
        <Tag accent={Accent.PRIMARY} Icon={Icon.Confirm} iconColor={THEME.color.charcoal} withCircleIcon>
          {missionStatusLabels.ENDED.libelle}
        </Tag>
      )

    case missionStatusLabels.UPCOMING.code:
      return (
        <Tag accent={Accent.PRIMARY} Icon={Icon.Clock} iconColor={THEME.color.mayaBlue} withCircleIcon>
          {missionStatusLabels.UPCOMING.libelle}
        </Tag>
      )

    default:
      return null
  }
}
