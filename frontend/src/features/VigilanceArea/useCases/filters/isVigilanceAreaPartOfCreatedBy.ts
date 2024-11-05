import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfCreatedBy(
  vigilanceArea: VigilanceArea.VigilanceArea,
  createdBy: string[] | undefined
): boolean {
  if (!createdBy || createdBy.length === 0) {
    return true
  }

  return !!createdBy.includes(vigilanceArea.createdBy ?? '')
}
