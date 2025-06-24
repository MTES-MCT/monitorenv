import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfVisibility(
  vigilanceArea: VigilanceArea.VigilanceArea,
  visibilityFilter: VigilanceArea.Visibility[]
): boolean {
  if (!visibilityFilter || visibilityFilter.length === 0 || !vigilanceArea.visibility) {
    return true
  }

  return visibilityFilter.includes(vigilanceArea.visibility)
}
