import { type Mission } from '../../../../domain/entities/missions'

export function isMissionPartOfSelectedMissionTags(mission: Mission, selectedMissionTagIds: number[] | undefined) {
  if (!selectedMissionTagIds || selectedMissionTagIds.length === 0) {
    return true
  }
  if (mission.missionTags?.length === 0) {
    return false
  }

  return mission.missionTags?.some(missionTag => selectedMissionTagIds.includes(missionTag.id))
}
