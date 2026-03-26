import { VigilanceArea } from '@features/VigilanceArea/types'
import { Accent, Tag } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function VisibilityCell({ visibility }: { visibility: VigilanceArea.Visibility | undefined }) {
  if (!visibility) {
    return <span>-</span>
  }

  return visibility === VigilanceArea.Visibility.PRIVATE ? <StyledTag accent={Accent.PRIMARY}>INTERNE</StyledTag> : ''
}

const StyledTag = styled(Tag)`
  font-style: normal;
`
