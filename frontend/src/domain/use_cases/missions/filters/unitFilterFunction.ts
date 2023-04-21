import type { MissionType } from '../../../entities/missions'

export function unitFilterFunction(mission: MissionType, filter: string[]) {
  if (filter.length > 0) {
    return !!mission.controlUnits.find(controlUnit => {
      if (filter.find(unit => unit === controlUnit.name)) {
        return controlUnit
      }

      return undefined
    })
  }

  return mission
}
