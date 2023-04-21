import _ from 'lodash'

import type { MissionType } from '../../../entities/missions'

export function themeFilterFunction(missions: MissionType[], filter: string[]) {
  if (filter.length > 0) {
    const missionWithActions = missions.filter(mission => mission.envActions.length > 0)

    const missionsWithThemes = missionWithActions.reduce((acc, curr) => {
      const actions = _.flatten(curr.envActions)

      const themes = _.flatten(actions.map((action: any) => action?.themes))
      const themesFormatted = themes?.map(theme => theme?.theme)

      return {
        ...acc,
        [curr.id]: themesFormatted
      }
    }, {})

    const filteredMissions = Object.entries<any>(missionsWithThemes).map(([key, value]) => {
      if (value.find(theme => filter.includes(theme))) {
        return key
      }

      return null
    })

    return missions.filter(mission => filteredMissions.includes(String(mission.id)))
  }

  return missions
}
