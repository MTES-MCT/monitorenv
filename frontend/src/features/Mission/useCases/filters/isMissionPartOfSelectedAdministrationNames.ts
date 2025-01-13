import type { Mission } from '../../../../domain/entities/missions'

export function isMissionPartOfSelectedAdministrationNames(
  mission: Mission,
  selectedAdministrationNames: string[] | undefined
): boolean {
  if (!selectedAdministrationNames || selectedAdministrationNames.length === 0) {
    return true
  }

  return selectedAdministrationNames.length
    ? !!mission.controlUnits.find(controlUnit => selectedAdministrationNames.includes(controlUnit.administration))
    : true
}
