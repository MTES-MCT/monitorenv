import { Icon, Tag, THEME } from '@mtes-mct/monitor-ui'
import { FrontCompletionStatus, FrontCompletionStatusLabel } from 'domain/entities/missions'

export function CompletionStatusTag({ completion = undefined }: { completion?: FrontCompletionStatus }) {
  if (!completion) {
    return null
  }
  switch (completion) {
    case FrontCompletionStatus.COMPLETED:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.mediumSeaGreen}
          data-cy="completion-mission-status-tag-completed"
          Icon={Icon.Confirm}
          iconColor={THEME.color.mediumSeaGreen}
          withCircleIcon
        >
          {FrontCompletionStatusLabel.COMPLETED}
        </Tag>
      )
    case FrontCompletionStatus.UP_TO_DATE:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.mediumSeaGreen}
          data-cy="completion-mission-status-tag-up-to-date"
          Icon={Icon.Confirm}
          iconColor={THEME.color.mediumSeaGreen}
          withCircleIcon
        >
          {FrontCompletionStatusLabel.UP_TO_DATE}
        </Tag>
      )
    case FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.maximumRed}
          data-cy="completion-mission-status-tag-to-completed-mission-ended"
          Icon={Icon.AttentionFilled}
          iconColor={THEME.color.maximumRed}
          withCircleIcon
        >
          {FrontCompletionStatusLabel.TO_COMPLETE}
        </Tag>
      )

    case FrontCompletionStatus.TO_COMPLETE:
      return (
        <Tag
          backgroundColor={THEME.color.gainsboro}
          color={THEME.color.charcoal}
          data-cy="completion-mission-status-tag-to-completed"
          Icon={Icon.AttentionFilled}
          iconColor={THEME.color.charcoal}
          withCircleIcon
        >
          {FrontCompletionStatusLabel.TO_COMPLETE}
        </Tag>
      )
    default:
      return null
  }
}
