import { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfStatus(
  vigilanceArea: VigilanceArea.VigilanceArea,
  status: VigilanceArea.Status[]
): boolean {
  if (status.length === 0) {
    return true
  }

  if (vigilanceArea.isDraft && status.includes(VigilanceArea.Status.DRAFT)) {
    return true
  }
  if (!vigilanceArea.isDraft && status.includes(VigilanceArea.Status.PUBLISHED)) {
    return true
  }

  return false
}
