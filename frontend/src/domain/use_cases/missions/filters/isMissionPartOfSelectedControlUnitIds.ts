import type { Mission } from '../../../entities/missions'

export function isMissionPartOfSelectedControlUnitIds(mission: Mission, selectedControlUnitIds: number[]): boolean {
  return selectedControlUnitIds.length
    ? !!mission.controlUnits.find(controlUnit => selectedControlUnitIds.includes(controlUnit.id))
    : true
}
