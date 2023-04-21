import type { MissionType } from '../../../entities/missions'

export function administrationFilterFunction(mission: MissionType, filter: string[]) {
  if (filter.length > 0) {
    return mission.controlUnits.find(controlUnit => {
      if (filter.find(adminFilter => adminFilter === controlUnit.administration)) {
        return controlUnit
      }

      return undefined
    })
  }

  return mission
}
