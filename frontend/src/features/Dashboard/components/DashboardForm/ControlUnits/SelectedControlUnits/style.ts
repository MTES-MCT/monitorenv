import { Textarea } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const StyledTextarea = styled(Textarea)`
  > textarea {
    background-color: ${p => p.theme.color.gainsboro};
    &:focus,
    &:active {
      background-color: ${p => p.theme.color.gainsboro} !important;
    }
  }
`
