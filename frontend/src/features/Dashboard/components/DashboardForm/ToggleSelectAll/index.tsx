import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { SelectedPinButton } from './style'

export type SelectionState = 'PARTIAL' | 'ALL' | 'NONE'

type ToggleSelectAllProps = {
  className?: string
  onSelection: () => void
  selectionState: SelectionState
}
export function ToggleSelectAll({ className, onSelection, selectionState }: ToggleSelectAllProps) {
  const getIcon = () => {
    switch (selectionState) {
      case 'ALL':
        return (
          <>
            <Icon.PinFilled color={THEME.color.blueGray} />
            Tout désélectionner
          </>
        )
      case 'PARTIAL':
        return (
          <>
            <Icon.Pin color={THEME.color.blueGray} />
            Tout sélectionner
          </>
        )
      case 'NONE':
        return (
          <>
            <Icon.Pin color={THEME.color.slateGray} />
            Tout sélectionner
          </>
        )
      default:
        return undefined
    }
  }

  return (
    <SelectedPinButton
      className={className}
      onClick={e => {
        e.stopPropagation()
        onSelection()
      }}
      type="button"
    >
      {getIcon()}
    </SelectedPinButton>
  )
}

export const StyledToggleSelectAll = styled(ToggleSelectAll)`
  margin-left: 6px;
`
