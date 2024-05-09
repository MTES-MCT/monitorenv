import { Mission } from '@features/Mission/mission.type'

export function getMissionTitle(
  isNewMission: boolean,
  values?: Partial<Mission.Mission> | Partial<Mission.NewMission>
) {
  return isNewMission
    ? `Nouvelle mission ${
        values?.controlUnits && values?.controlUnits.length > 0 && values?.controlUnits[0]?.name ? '-' : ''
      } ${values?.controlUnits?.map(controlUnit => controlUnit.name).join(', ')}
      `
    : `Mission ${
        values?.missionTypes &&
        values?.missionTypes.map(missionType => Mission.missionTypeLabels[missionType].libelle).join(' / ')
      } – ${values?.controlUnits?.map(controlUnit => controlUnit.name?.replace('(historique)', '')).join(', ')}`
}
