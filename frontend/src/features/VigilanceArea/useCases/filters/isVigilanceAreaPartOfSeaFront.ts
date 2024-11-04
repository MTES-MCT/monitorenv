import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfSeaFront(vigilanceArea: VigilanceArea.VigilanceArea, seaFront: string[]): boolean {
  if (seaFront.length === 0) {
    return true
  }

  return !!seaFront.includes(vigilanceArea.seaFront ?? '')
}
