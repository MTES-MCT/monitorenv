import type { Mission } from '../../../entities/missions'

export function isMissionPartOfSelectedWithEnvActions(mission: Mission, selectedWithEnvActions: boolean): boolean {
  if (!selectedWithEnvActions) {
    return true
  }

  return mission.envActions.length > 0
}
