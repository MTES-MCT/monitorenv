import { Mission } from '@features/Mission/mission.type'

export function isMissionPartOfSelectedAdministrationNames(
  mission: Mission.Mission,
  selectedAdministrationNames: string[] | undefined
): boolean {
  if (!selectedAdministrationNames || selectedAdministrationNames.length === 0) {
    return true
  }

  return selectedAdministrationNames.length
    ? !!mission.controlUnits.find(controlUnit => selectedAdministrationNames.includes(controlUnit.administration))
    : true
}
