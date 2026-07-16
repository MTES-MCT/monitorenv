import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

interface ResetButtonProps {
  label?: string
  onClick: () => void
}

export function ResetButton({ label = 'Réinitialiser les filtres', onClick }: ResetButtonProps) {
  return (
    <ResetFiltersButton onClick={onClick}>
      <Icon.Load size={14} />
      <span>{label}</span>
    </ResetFiltersButton>
  )
}

const ResetFiltersButton = styled.button`
  align-items: end;
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  text-decoration: underline;
  > span {
    font-size: 13px;
  }
  padding: 0;
  background: transparent;
`
