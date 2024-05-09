import { Mission } from '@features/Mission/mission.type'

export function getMissionTypeCell(missionTypes: Mission.MissionTypeEnum[]) {
  const missionTypesAsText = missionTypes?.map(t => Mission.missionTypeLabels[t]?.libelle).join(', ')

  return missionTypesAsText
}
