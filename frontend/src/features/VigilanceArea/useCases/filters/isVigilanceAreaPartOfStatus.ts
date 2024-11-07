import { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfStatus(
  vigilanceArea: VigilanceArea.VigilanceArea,
  status: VigilanceArea.Status[]
): boolean {
  if (status.length === 0) {
    return true
  }

  return (
    (vigilanceArea.isDraft && status.includes(VigilanceArea.Status.DRAFT)) ||
    (!vigilanceArea.isDraft && status.includes(VigilanceArea.Status.PUBLISHED))
  )
}
