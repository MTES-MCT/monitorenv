import type { EnvActionTheme } from '../domain/entities/missions'

export function extractThemesAsText(themes: EnvActionTheme[]) {
  if (!(themes?.length > 0)) {
    return ''
  }

  return themes.map(t => t.theme).join(' - ')
}
