import { missionTypeEnum, type Mission, type NewMission } from '../domain/entities/missions'

export function getMissionTitle(isNewMission: boolean, values?: Partial<Mission> | Partial<NewMission>) {
  return isNewMission
    ? `Nouvelle mission ${
        values?.controlUnits && values?.controlUnits.length > 0 && values?.controlUnits[0]?.name ? '-' : ''
      } ${values?.controlUnits?.map(controlUnit => controlUnit.name).join(', ')}`
    : `${values?.id} - Mission ${
        values?.missionTypes &&
        values?.missionTypes.map(missionType => missionTypeEnum[missionType].libelle).join(' / ')
      } – ${values?.controlUnits?.map(controlUnit => controlUnit.name?.replace('(historique)', '')).join(', ')}`
}
