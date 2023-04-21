import type { Mission } from '../../../entities/missions'

export function themeFilterFunction(mission: Mission, themeFilter: string[]) {
  if (themeFilter.length === 0) {
    return true
  }
  if (mission.envActions.length === 0) {
    return false
  }

  const missionThemes = mission.envActions.flatMap((action: any) => action.themes?.flatMap(theme => theme.theme))
  const themesFiltered = missionThemes.filter(theme => themeFilter.includes(theme))

  return themesFiltered.length > 0
}
