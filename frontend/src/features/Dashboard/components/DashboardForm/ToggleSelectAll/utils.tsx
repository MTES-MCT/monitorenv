import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { difference, intersection, isEqual } from 'lodash-es'
import React from 'react'

import type { SelectionState } from '.'
import type { NearbyUnit } from '@features/Dashboard/components/DashboardForm/NearbyUnits/types'
import type { Dashboard } from '@features/Dashboard/types'

export function getSelectionStateNearbyUnit(nearbyUnit: NearbyUnit, selectedNearbyUnits: NearbyUnit[]) {
  if (selectedNearbyUnits.some(selectedNearbyUnit => isEqual(selectedNearbyUnit, nearbyUnit))) {
    return 'ALL'
  }
  const isUnitPresent = selectedNearbyUnits.map(({ controlUnit }) => controlUnit.id).includes(nearbyUnit.controlUnit.id)

  if (isUnitPresent) {
    return 'PARTIAL'
  }

  return 'NONE'
}

export function getSelectionState(selectedIds: number[], allIds: number[]) {
  if (
    allIds.length === 0 ||
    (selectedIds.length > 0 &&
      selectedIds.length >= allIds.length &&
      selectedIds.some(selectedId => allIds.includes(selectedId)))
  ) {
    return 'ALL'
  }

  if (selectedIds.length > 0 || selectedIds.some(selectedId => allIds.includes(selectedId))) {
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
  const itemIds = () => {
    if (selectionState === 'ALL') {
      return allIds.length > 0 ? intersection(allIds, selectedIds) : selectedIds
    }

    return difference(allIds, selectedIds)
  }

  const payload = { itemIds: itemIds(), type }

  if (selectionState === 'ALL') {
    onRemove(payload)
  } else {
    onSelect(payload)
  }
}

export const getPinIcon = (
  topicSelectionState: SelectionState,
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  label = 'Sélectionner la/les zone(s)'
) => {
  switch (topicSelectionState) {
    case 'ALL':
      return (
        <IconButton
          accent={Accent.TERTIARY}
          aria-label={label}
          color={THEME.color.blueGray}
          Icon={Icon.PinFilled}
          onClick={onClick}
          title={label}
        />
      )
    case 'PARTIAL':
      return (
        <IconButton
          accent={Accent.TERTIARY}
          aria-label={label}
          color={THEME.color.blueGray}
          Icon={Icon.Pin}
          onClick={onClick}
          title={label}
        />
      )
    case 'NONE':
      return (
        <IconButton
          accent={Accent.TERTIARY}
          aria-label={label}
          color={THEME.color.slateGray}
          Icon={Icon.Pin}
          onClick={onClick}
          title={label}
        />
      )
    default:
      return undefined
  }
}
