import type { Mission } from '../../../../domain/entities/missions'

export function isMissionPartOfSelectedIsNoteworthy(mission: Mission, selectedWithEnvActions: boolean): boolean {
  if (!selectedWithEnvActions) {
    return true
  }

  return !!mission.isNoteworthy
}
