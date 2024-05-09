import { Mission } from '@features/Mission/mission.type'

export function isMissionPartOfSelectedControlUnitIds(
  mission: Mission.Mission,
  selectedControlUnitIds: number[] | undefined
): boolean {
  if (!selectedControlUnitIds || selectedControlUnitIds.length === 0) {
    return true
  }

  return selectedControlUnitIds.length
    ? !!mission.controlUnits.find(controlUnit => selectedControlUnitIds.includes(controlUnit.id))
    : true
}
