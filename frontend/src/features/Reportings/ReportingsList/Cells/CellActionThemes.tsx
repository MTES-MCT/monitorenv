import { useMemo } from 'react'

import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'

export function CellActionThemes({ subThemeIds, themeId }: { subThemeIds: number[]; themeId: number }) {
  const { subThemes, themes } = useGetControlPlans()
  const cellContent = useMemo(() => {
    if (!themeId) {
      return ''
    }

    const themeAsString = themes[themeId]?.theme ?? ''

    if (subThemeIds.length === 0) {
      return themeAsString
    }
    const subThemesAsString = subThemeIds.map(subThemeId => subThemes[subThemeId]?.subTheme)

    return `${themeAsString}: ${subThemesAsString.join(', ')}`
  }, [themeId, subThemeIds, subThemes, themes])

  return cellContent !== '' ? (
    <span data-cy="cell-theme" title={cellContent}>
      {cellContent}
    </span>
  ) : null
}
