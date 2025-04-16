import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfTag(
  vigilanceArea: VigilanceArea.VigilanceArea,
  tags: string[] | undefined
): boolean {
  if (!tags || tags.length === 0) {
    return true
  }

  return !!vigilanceArea.tags && vigilanceArea.tags?.map(({ name }) => name).some(tag => tags.includes(tag))
}
