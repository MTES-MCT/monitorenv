import { getMissionCompletionStatus, getTotalOfControls } from '@features/Mission/utils'
import { FrontCompletionStatus, FrontCompletionStatusLabel, getMissionStatus } from 'domain/entities/missions'

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
      statusA === FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED
        ? FrontCompletionStatusLabel[FrontCompletionStatus.TO_COMPLETE]
        : FrontCompletionStatusLabel[statusA]
  }

  let statusBLabel = statusB
  if (statusB !== '') {
    statusBLabel =
      statusB === FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED
        ? FrontCompletionStatusLabel[FrontCompletionStatus.TO_COMPLETE]
        : FrontCompletionStatusLabel[statusB]
  }

  return statusALabel.localeCompare(statusBLabel)
}
