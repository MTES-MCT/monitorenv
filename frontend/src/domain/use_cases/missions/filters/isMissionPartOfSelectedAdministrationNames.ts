import type { Mission } from '../../../entities/missions'

export function isMissionPartOfSelectedAdministrationNames(
  mission: Mission,
  selectedAdministrationNames: string[]
): boolean {
  return selectedAdministrationNames.length
    ? !!mission.controlUnits.find(controlUnit => selectedAdministrationNames.includes(controlUnit.administration))
    : true
}
