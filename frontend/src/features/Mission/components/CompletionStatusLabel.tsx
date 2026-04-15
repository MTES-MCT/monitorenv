import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { FrontCompletionStatus, FrontCompletionStatusLabel } from 'domain/entities/missions'
import styled from 'styled-components'

export function CompletionStatusLabel({ completion = undefined }: { completion?: FrontCompletionStatus }) {
  if (!completion) {
    return <>{UNKNOWN}</>
  }
  switch (completion) {
    case FrontCompletionStatus.COMPLETED:
      return (
        <CompletionStatusContainer style={{ backgroundColor: THEME.color.mediumSeaGreen25 }}>
          <Icon.Confirm color={THEME.color.mediumSeaGreen} />
          <Text $color={THEME.color.mediumSeaGreen}>{FrontCompletionStatusLabel.COMPLETED}</Text>
        </CompletionStatusContainer>
      )
    case FrontCompletionStatus.UP_TO_DATE:
      return (
        <CompletionStatusContainer style={{ backgroundColor: THEME.color.mediumSeaGreen25 }}>
          <Icon.Confirm color={THEME.color.mediumSeaGreen} />
          <Text $color={THEME.color.mediumSeaGreen}>{FrontCompletionStatusLabel.UP_TO_DATE}</Text>
        </CompletionStatusContainer>
      )
    case FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED:
      return (
        <CompletionStatusContainer style={{ backgroundColor: THEME.color.maximumRed15 }}>
          <Icon.AttentionFilled color={THEME.color.maximumRed} />
          <Text $color={THEME.color.maximumRed}>{FrontCompletionStatusLabel.TO_COMPLETE}</Text>
        </CompletionStatusContainer>
      )

    case FrontCompletionStatus.TO_COMPLETE:
      return (
        <CompletionStatusContainer style={{ backgroundColor: THEME.color.gainsboro }}>
          <Icon.AttentionFilled color={THEME.color.charcoal} />
          <Text $color={THEME.color.charcoal}>{FrontCompletionStatusLabel.TO_COMPLETE}</Text>
        </CompletionStatusContainer>
      )
    default:
      return null
  }
}

const CompletionStatusContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  padding: 0 4px 0 2px;
`

const Text = styled.span<{ $color: string }>`
  color: ${p => p.$color};
`
