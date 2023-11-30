import { missionTypeEnum } from '../domain/entities/missions'

/**
 * format mission types to a string
 */
export function humanizeMissionTypes(missionTypes: string[] | undefined): string {
  if (!missionTypes) {
    return ''
  }
  const firstMissionTypeIndex = missionTypes[0]
  if (missionTypes.length === 1 && firstMissionTypeIndex) {
    return missionTypeEnum[firstMissionTypeIndex]?.libelle
  }

  return missionTypes.map(missionType => missionTypeEnum[missionType]?.libelle).toString()
}
