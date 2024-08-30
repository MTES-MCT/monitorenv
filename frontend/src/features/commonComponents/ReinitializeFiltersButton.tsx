import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

interface ReinitializeFiltersButtonProps {
  onClick: () => void
}

export function ReinitializeFiltersButton({ onClick }: ReinitializeFiltersButtonProps) {
  return (
    <ResetFiltersButton data-cy="reinitialize-filters" onClick={onClick}>
      <Icon.Reset size={14} />
      <span>Réinitialiser les filtres</span>
    </ResetFiltersButton>
  )
}

const ResetFiltersButton = styled.div`
  align-items: end;
  cursor: pointer;
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  text-decoration: underline;
  > span {
    font-size: 13px;
  }
`
