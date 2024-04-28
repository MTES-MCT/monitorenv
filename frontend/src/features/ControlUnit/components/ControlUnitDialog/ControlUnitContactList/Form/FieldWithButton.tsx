import { IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

const BareFieldWithIconButton = styled.div`
  display: flex;
  align-items: flex-end;

  > *:first-child {
    flex-grow: 1;
    margin-right: 4px;
  }
`

const IconButtonOff = styled(IconButton)`
  background-color: ${p => p.theme.color.white};
  border-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.charcoal};
  padding: 4.5px;

  &:hover {
    background-color: ${p => p.theme.color.white};
    border-color: ${p => p.theme.color.white};
    color: ${p => p.theme.color.blueYonder};
  }
`

const IconButtonOn = styled(IconButtonOff)`
  background-color: ${p => p.theme.color.charcoal};
  border-color: ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.white};
`

export const FieldWithButton = Object.assign(BareFieldWithIconButton, {
  IconButtonOff,
  IconButtonOn
})
