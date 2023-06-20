import { missionTypeEnum, type Mission } from '../domain/entities/missions'

export function getMissionTitle(isNewMission: boolean, values?: Partial<Mission>) {
  return isNewMission
    ? 'Nouvelle mission'
    : `Mission ${
        values?.missionTypes &&
        values?.missionTypes.map(missionType => missionTypeEnum[missionType].libelle).join(' / ')
      } – ${values?.controlUnits?.map(controlUnit => controlUnit.name?.replace('(historique)', '')).join(', ')}`
}
