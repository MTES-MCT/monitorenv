import { Mission } from '@features/Mission/mission.type'

export function isMissionPartOfSelectedWithEnvActions(
  mission: Mission.Mission,
  selectedWithEnvActions: boolean
): boolean {
  if (!selectedWithEnvActions) {
    return true
  }

  return mission.envActions.length > 0
}
