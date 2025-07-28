import { MissionTypeEnum, missionTypeEnum } from 'domain/entities/missions'

export function getMissionTypeCell(missionTypes: MissionTypeEnum[]) {
  const missionTypesAsText = missionTypes?.map(t => missionTypeEnum[t]?.libelle).join(', ')

  return missionTypesAsText
}
