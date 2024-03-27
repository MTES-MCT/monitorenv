import { sum } from 'lodash'

import { ActionTypeEnum, type Mission, type NewMission } from '../../domain/entities/missions'

export const getTotalOfControls = (mission: Partial<Mission | NewMission>) =>
  sum(
    mission.envActions?.map(
      control => (control.actionType === ActionTypeEnum.CONTROL && control.actionNumberOfControls) || 0
    )
  )

export const getTotalOfSurveillances = (mission: Partial<Mission | NewMission>) =>
  mission.envActions?.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE).length

export function getVesselName(vesselName) {
  return vesselName === 'UNKNOWN' ? 'Navire inconnu' : vesselName
}
