import { Icon, LinkButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

interface ResetButtonProps {
  label?: string
  onClick: () => void
}

export function ResetButton({ label = 'Réinitialiser les filtres', onClick }: ResetButtonProps) {
  return (
    <StyledLinkButton Icon={Icon.Load} onClick={onClick}>
      <span>{label}</span>
    </StyledLinkButton>
  )
}

const StyledLinkButton = styled(LinkButton)`
  white-space: nowrap;
  color: ${p => p.theme.color.charcoal} !important;
  svg,
  span {
    color: ${p => p.theme.color.charcoal};
  }
  &:hover svg,
  &:active svg,
  &:focus svg {
    color: ${p => p.theme.color.charcoal};
  }
`
