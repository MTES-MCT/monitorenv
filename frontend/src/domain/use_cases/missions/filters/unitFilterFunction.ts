import type { Mission } from '../../../entities/missions'

export function unitFilterFunction(mission: Mission, filter: string[]) {
  if (filter.length === 0) {
    return true
  }

  return !!mission.controlUnits.find(controlUnit => {
    if (filter.find(unit => unit === controlUnit.name)) {
      return controlUnit
    }

    return false
  })
}
