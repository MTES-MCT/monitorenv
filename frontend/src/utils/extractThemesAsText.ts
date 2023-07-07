import type { EnvActionTheme } from '../domain/entities/missions'

export function extractThemesAsText(themes: EnvActionTheme[]) {
  if (!(themes?.length > 0)) {
    return ''
  }

  return themes
    .reduce((acc, t) => {
      if (t?.theme) {
        acc.push(t.theme)
      }

      return acc
    }, [] as string[])
    .join(' - ')
}
