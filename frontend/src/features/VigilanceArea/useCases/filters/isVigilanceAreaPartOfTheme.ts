import type { VigilanceArea } from '@features/VigilanceArea/types'

export function isVigilanceAreaPartOfTheme(
  vigilanceArea: VigilanceArea.VigilanceArea,
  themes: string[] | undefined
): boolean {
  if (!themes || themes.length === 0) {
    return true
  }

  return vigilanceArea.themes?.some(theme => themes.includes(theme))
}
