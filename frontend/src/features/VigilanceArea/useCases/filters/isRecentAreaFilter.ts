import { hasMoreThanThirtyDays } from '@utils/hasMoreThanThirtyDays'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isRecentAreaFilter(
  vigilanceArea: VigilanceArea.VigilanceArea,
  areRecentsAreasChecked: boolean
): boolean {
  if (!areRecentsAreasChecked) {
    return true
  }
  const isNew = hasMoreThanThirtyDays(vigilanceArea.createdAt)
  const isUpdatedRecently = hasMoreThanThirtyDays(vigilanceArea.updatedAt)

  return isNew || isUpdatedRecently
}
