import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function GroupValueOnlyMessage({ onClose }: { onClose: () => void }) {
  return (
    <Wrapper>
      <p>
        Les modifications impacteront uniquement les réglementations <Underline>qui utilisent</Underline> la valeur du
        groupe.
      </p>
      <IconButton accent={Accent.TERTIARY} color="#45688a" Icon={Icon.Close} onClick={onClose} title="Fermer" />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.blueGray25};
  border: 1px solid ${p => p.theme.color.blueGray};
  color: #45688a;
  display: flex;
  font-weight: bold;
  gap: 8px;
  justify-content: space-between;
  padding: 16px;
`
const Underline = styled.span`
  text-decoration: underline;
`
