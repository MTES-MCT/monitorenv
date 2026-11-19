import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

/** Displayed when the group value changed while some regulatory areas use their own value */
export function GroupValueOnlyMessage() {
  return (
    <Wrapper role="status">
      <Icon.Info color={THEME.color.slateGray} />
      <p>Les modifications impacteront uniquement les réglementations qui utilisent la valeur du groupe.</p>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.blueGray25};
  border: 1px solid ${p => p.theme.color.blueGray};
  color: #45688a;
  display: flex;
  gap: 8px;
  padding: 16px;
`
