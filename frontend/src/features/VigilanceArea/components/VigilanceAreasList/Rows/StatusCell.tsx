import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function StatusCell({ isDraft }: { isDraft: boolean }) {
  if (isDraft) {
    return (
      <StatusContainer $color={THEME.color.slateGray}>
        <Icon.EditUnbordered color={THEME.color.slateGray} />
        Non Publiée
      </StatusContainer>
    )
  }

  return (
    <StatusContainer $color={THEME.color.charcoal}>
      <Icon.Check color={THEME.color.charcoal} />
      Publiée
    </StatusContainer>
  )
}

const StatusContainer = styled.div<{ $color: string }>`
  align-items: center;
  color: ${p => p.$color};
  display: flex;
  gap: 4px;
`
