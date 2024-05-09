import { Mission } from '@features/Mission/mission.type'

import { getMissionCompletionStatus, getMissionStatus, getTotalOfControls } from '../../utils'

import type { Row } from '@tanstack/react-table'

export function sortNumberOfControls(rowA: Row<any>, rowB: Row<any>, columnId: string) {
  return getTotalOfControls(rowA.original[columnId]) - getTotalOfControls(rowB.original[columnId])
}

export function sortStatus(rowA: Row<any>, rowB: Row<any>) {
  return getMissionStatus(rowA.original).localeCompare(getMissionStatus(rowB.original))
}

export function sortCompletion(rowA: Row<any>, rowB: Row<any>) {
  const statusA: string = getMissionCompletionStatus(rowA.original) ?? ''
  const statusB: string = getMissionCompletionStatus(rowB.original) ?? ''

  let statusALabel = statusA
  if (statusA !== '') {
    statusALabel =
      statusA === Mission.FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED
        ? Mission.FrontCompletionStatusLabel[Mission.FrontCompletionStatus.TO_COMPLETE]
        : Mission.FrontCompletionStatusLabel[statusA]
  }

  let statusBLabel = statusB
  if (statusB !== '') {
    statusBLabel =
      statusB === Mission.FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED
        ? Mission.FrontCompletionStatusLabel[Mission.FrontCompletionStatus.TO_COMPLETE]
        : Mission.FrontCompletionStatusLabel[statusB]
  }

  return statusALabel.localeCompare(statusBLabel)
}
