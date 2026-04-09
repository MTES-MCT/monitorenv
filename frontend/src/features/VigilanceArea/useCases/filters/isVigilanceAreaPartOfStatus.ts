import { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfStatus(
  vigilanceArea: VigilanceArea.VigilanceArea,
  status?: 'PUBLISHED' | 'DRAFT'
): boolean {
  if (!status) {
    return true
  }

  return (
    (vigilanceArea.isDraft && status === VigilanceArea.Status.DRAFT) ||
    (!vigilanceArea.isDraft && status === VigilanceArea.Status.PUBLISHED)
  )
}
