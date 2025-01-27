import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { difference, intersection } from 'lodash'

import type { SelectionState } from '.'
import type { Dashboard } from '@features/Dashboard/types'

export function getSelectionState(selectedIds: number[], allIds: number[]) {
  if (
    allIds.length === 0 ||
    (selectedIds.length > 0 &&
      selectedIds.length >= allIds.length &&
      selectedIds.some(selectedId => allIds.includes(selectedId)))
  ) {
    return 'ALL'
  }

  if (selectedIds.some(selectedId => allIds.includes(selectedId))) {
    return 'PARTIAL'
  }

  return 'NONE'
}

type SelectionParams = {
  allIds: number[]
  onRemove: (payload: { itemIds: number[]; type: Dashboard.Block }) => void
  onSelect: (payload: { itemIds: number[]; type: Dashboard.Block }) => void
  selectedIds: number[]
  selectionState: SelectionState
  type: Dashboard.Block
}

export function handleSelection({ allIds, onRemove, onSelect, selectedIds, selectionState, type }: SelectionParams) {
  const itemIds = selectionState === 'ALL' ? intersection(allIds, selectedIds) : difference(allIds, selectedIds)

  const payload = { itemIds, type }

  if (selectionState === 'ALL') {
    onRemove(payload)
  } else {
    onSelect(payload)
  }
}

export const getPinIcon = (
  topicSelectionState: SelectionState,
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
) => {
  switch (topicSelectionState) {
    case 'ALL':
      return (
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la/les zone(s)"
          color={THEME.color.blueGray}
          Icon={Icon.PinFilled}
          onClick={onClick}
          title="Sélectionner la/les zone(s)"
        />
      )
    case 'PARTIAL':
      return (
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la/les zone(s)"
          color={THEME.color.blueGray}
          Icon={Icon.Pin}
          onClick={onClick}
          title="Sélectionner la/les zone(s)"
        />
      )
    case 'NONE':
      return (
        <IconButton
          accent={Accent.TERTIARY}
          aria-label="Sélectionner la/les zone(s)"
          color={THEME.color.slateGray}
          Icon={Icon.Pin}
          onClick={onClick}
          title="Sélectionner la/les zone(s)"
        />
      )
    default:
      return undefined
  }
}
