import { Accent, Icon, Tag, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function StatusCell({ isDraft }: { isDraft: boolean }) {
  if (isDraft) {
    return (
      <StyledTag accent={Accent.PRIMARY} Icon={Icon.EditUnbordered}>
        Brouillon
      </StyledTag>
    )
  }

  return (
    <StyledTag backgroundColor="#D4F0DF" color={THEME.color.mediumSeaGreen}>
      Publiée
    </StyledTag>
  )
}

const StyledTag = styled(Tag)`
  font-style: normal;
`
