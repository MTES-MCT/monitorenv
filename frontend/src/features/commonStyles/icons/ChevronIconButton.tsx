import { Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type ChevronProps = {
  $isOpen: boolean
  onClick?: () => void
}

export function ChevronIconButton({ $isOpen, onClick }: ChevronProps) {
  return (
    <StyledChevronButton
      $isOpen={$isOpen}
      Icon={Icon.Chevron}
      onClick={onClick}
      title={$isOpen ? 'Fermer' : 'Ouvrir'}
    />
  )
}

export const StyledChevronButton = styled(IconButton)<ChevronProps>`
  width: 16px;
  height: 16px;
  margin-top: 3px;
  margin-right: 8px;
  transform: ${props => (!props.$isOpen ? 'rotate(0deg)' : 'rotate(-180deg)')};
  transition: all 0.5s;

  margin-left: auto;

  &:hover {
    background: transparent;
    border: 1px solid transparent;
  }
`

export const StyledChevronIcon = styled(Icon.Chevron)<ChevronProps>`
  width: 16px;
  height: 16px;
  transform: ${props => (!props.$isOpen ? 'rotate(0deg)' : 'rotate(-180deg)')};
  transition: all 0.5s;
  margin-left: auto;
`
