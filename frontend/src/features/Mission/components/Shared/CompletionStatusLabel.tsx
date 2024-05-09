import { Mission } from '@features/Mission/mission.type'
import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function CompletionStatusLabel({ completion = undefined }: { completion?: Mission.FrontCompletionStatus }) {
  if (!completion) {
    return <>-</>
  }
  switch (completion) {
    case Mission.FrontCompletionStatus.COMPLETED:
      return (
        <CompletionStatusContainer>
          <Icon.Confirm color={THEME.color.mediumSeaGreen} />
          <Text $color={THEME.color.mediumSeaGreen}>{Mission.FrontCompletionStatusLabel.COMPLETED}</Text>
        </CompletionStatusContainer>
      )
    case Mission.FrontCompletionStatus.UP_TO_DATE:
      return (
        <CompletionStatusContainer>
          <Icon.Confirm color={THEME.color.mediumSeaGreen} />
          <Text $color={THEME.color.mediumSeaGreen}>{Mission.FrontCompletionStatusLabel.UP_TO_DATE}</Text>
        </CompletionStatusContainer>
      )
    case Mission.FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED:
      return (
        <CompletionStatusContainer>
          <Icon.AttentionFilled color={THEME.color.maximumRed} />
          <Text $color={THEME.color.maximumRed}>{Mission.FrontCompletionStatusLabel.TO_COMPLETE}</Text>
        </CompletionStatusContainer>
      )

    case Mission.FrontCompletionStatus.TO_COMPLETE:
      return (
        <CompletionStatusContainer>
          <Icon.AttentionFilled color={THEME.color.charcoal} />
          <Text $color={THEME.color.charcoal}>{Mission.FrontCompletionStatusLabel.TO_COMPLETE}</Text>
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
`

const Text = styled.span<{ $color: string }>`
  color: ${p => p.$color};
`
