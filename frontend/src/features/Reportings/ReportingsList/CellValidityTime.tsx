import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function CellValidityTime({ validityTime }) {
  return (
    <>
      <Icon.Clock />
      <Validity>{validityTime ? `${validityTime}h` : '—'}</Validity>
    </>
  )
}

const Validity = styled.span`
  vertical-align: top;
  padding-left: 4px;
`
