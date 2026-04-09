import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfVisibility(
  vigilanceArea: VigilanceArea.VigilanceArea,
  visibilityFilter: 'PUBLIC' | 'PRIVATE' | undefined
): boolean {
  if (!visibilityFilter || !vigilanceArea.visibility) {
    return true
  }

  return visibilityFilter === vigilanceArea.visibility
}
