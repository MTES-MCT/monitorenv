import type { ThemeOption } from 'domain/entities/themes'

export function isPartOfThemes({
  filterThemes,
  themesToCompare
}: {
  filterThemes: ThemeOption[]
  themesToCompare: ThemeOption[]
}) {
  const themesToCompareWithoutChildren = themesToCompare
    ? [...themesToCompare.filter(theme => theme.subThemes?.length === 0)]
    : []
  const subThemesToCompare = themesToCompare ? [...themesToCompare.flatMap(({ subThemes }) => subThemes)] : []

  const allThemesWithoutChildrenFilter = [...filterThemes.filter(themeFilter => themeFilter?.subThemes?.length === 0)]
  const allSubThemesFilter = filterThemes.flatMap(themeFilter => themeFilter?.subThemes || [])

  const hasMatchingSubThemes = allSubThemesFilter.some(themeFilter =>
    subThemesToCompare.some(theme => theme?.id === themeFilter.id)
  )

  let hasMatchingThemes = false
  if (themesToCompareWithoutChildren.length > 0) {
    hasMatchingThemes = allThemesWithoutChildrenFilter.some(themeFilter =>
      themesToCompareWithoutChildren.some(theme => theme.id === themeFilter.id)
    )
  }

  return hasMatchingThemes || hasMatchingSubThemes
}
