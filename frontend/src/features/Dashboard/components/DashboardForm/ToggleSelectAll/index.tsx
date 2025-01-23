import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { SelectedPinButton } from '../style'

export type SelectionState = 'PARTIAL' | 'ALL' | 'NONE'

type ToggleSelectAllProps = {
  onSelection: () => void
  selectionState: SelectionState
}
export function ToggleSelectAll({ onSelection, selectionState }: ToggleSelectAllProps) {
  const getIcon = () => {
    switch (selectionState) {
      case 'ALL':
        return (
          <>
            <Icon.PinFilled color={THEME.color.blueGray} title="Désélectionner tous" />
            Désélectionner tous
          </>
        )
      case 'PARTIAL':
        return (
          <>
            <Icon.Pin color={THEME.color.blueGray} title="Sélectionner tous" />
            Sélectionner tous
          </>
        )
      case 'NONE':
        return (
          <>
            <Icon.Pin color={THEME.color.slateGray} title="Sélectionner tous" />
            Sélectionner tous
          </>
        )
      default:
        return undefined
    }
  }

  return (
    <SelectedPinButton
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
