import { Mission } from '@features/Mission/mission.type'

/**
 * format mission types to a string
 */
export function humanizeMissionTypes(missionTypes: string[] | undefined): string {
  if (!missionTypes) {
    return ''
  }
  const firstMissionTypeIndex = missionTypes[0]
  if (missionTypes.length === 1 && firstMissionTypeIndex) {
    return Mission.missionTypeLabels[firstMissionTypeIndex]?.libelle
  }

  return missionTypes.map(missionType => Mission.missionTypeLabels[missionType]?.libelle).toString()
}
