import { missionTypeEnum } from '../domain/entities/missions'

/**
 * format mission types to a string
 */
export function missionTypesToString(missionTypes: [string]): string {
  if (missionTypes.length === 1) {
    return missionTypeEnum[missionTypes[0]]?.libelle
  }

  return missionTypes.map(missionType => missionTypeEnum[missionType]?.libelle).toString()
}
