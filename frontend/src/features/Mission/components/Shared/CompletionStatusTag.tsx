import { Mission } from '@features/Mission/mission.type'
import { Icon, Tag, THEME } from '@mtes-mct/monitor-ui'

export function CompletionStatusTag({ completion = undefined }: { completion?: Mission.FrontCompletionStatus }) {
  if (!completion) {
    return null
  }
  switch (completion) {
    case Mission.FrontCompletionStatus.COMPLETED:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.mediumSeaGreen}
          data-cy="completion-mission-status-tag-completed"
          Icon={Icon.Confirm}
          iconColor={THEME.color.mediumSeaGreen}
          withCircleIcon
        >
          {Mission.FrontCompletionStatusLabel.COMPLETED}
        </Tag>
      )
    case Mission.FrontCompletionStatus.UP_TO_DATE:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.mediumSeaGreen}
          data-cy="completion-mission-status-tag-up-to-date"
          Icon={Icon.Confirm}
          iconColor={THEME.color.mediumSeaGreen}
          withCircleIcon
        >
          {Mission.FrontCompletionStatusLabel.UP_TO_DATE}
        </Tag>
      )
    case Mission.FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.maximumRed}
          data-cy="completion-mission-status-tag-to-completed-mission-ended"
          Icon={Icon.AttentionFilled}
          iconColor={THEME.color.maximumRed}
          withCircleIcon
        >
          {Mission.FrontCompletionStatusLabel.TO_COMPLETE}
        </Tag>
      )

    case Mission.FrontCompletionStatus.TO_COMPLETE:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.charcoal}
          data-cy="completion-mission-status-tag-to-completed"
          Icon={Icon.AttentionFilled}
          iconColor={THEME.color.charcoal}
          withCircleIcon
        >
          {Mission.FrontCompletionStatusLabel.TO_COMPLETE}
        </Tag>
      )
    default:
      return null
  }
}
