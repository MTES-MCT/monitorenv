import type { Mission } from '../../../../domain/entities/missions'

export function isMissionPartOfSelectedControlUnitIds(
  mission: Mission,
  selectedControlUnitIds: number[] | undefined
): boolean {
  if (!selectedControlUnitIds || selectedControlUnitIds.length === 0) {
    return true
  }

  return selectedControlUnitIds.length
    ? !!mission.controlUnits.find(controlUnit => selectedControlUnitIds.includes(controlUnit.id))
    : true
}
