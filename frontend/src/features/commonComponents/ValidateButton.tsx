import { Button } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const ValidateButton = styled(Button)`
  background: ${p => p.theme.color.mediumSeaGreen};
  border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  color: ${p => p.theme.color.white};
  &:not(:disabled):hover {
    background: ${p => p.theme.color.mediumSeaGreen};
    border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  }
`
