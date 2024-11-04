import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfCreatedBy(
  vigilanceArea: VigilanceArea.VigilanceArea,
  createdBy: string[]
): boolean {
  if (createdBy.length === 0) {
    return true
  }

  return !!createdBy.includes(vigilanceArea.createdBy ?? '')
}
