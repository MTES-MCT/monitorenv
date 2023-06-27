import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

const Wrapper = styled.div<{ $isExpanded: boolean }>`
  height: 38px;
  font-size: 16px;
  line-height: 22px;
  padding-top: 6px;
  padding-left: 16px;
  padding-right: 4px;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  cursor: pointer;
  text-align: left;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${props => (props.$isExpanded ? '0' : '2px')};
  border-bottom-right-radius: ${props => (props.$isExpanded ? '0' : '2px')};
  background: ${p => p.theme.color.charcoal};
`
const Title = styled.span`
  flex: 1;
`

const Pin = styled(Icon.Pin)`
  margin-right: 8px;
  margin-top: 2px;
`

export const LayerType = {
  Pin,
  Title,
  Wrapper
}
