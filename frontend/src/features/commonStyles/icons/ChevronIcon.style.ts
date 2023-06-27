import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const ChevronIcon = styled(Icon.Chevron)<{ $isOpen: boolean; $right: boolean }>`
  width: 16px;
  height: 16px;
  margin-top: 3px;
  margin-right: 8px;
  transform: ${props => (!props.$isOpen ? 'rotate(0deg)' : 'rotate(-180deg)')};
  transition: all 0.5s;
  cursor: pointer;
  ${props => props.$right && 'margin-left: auto;'}
`
