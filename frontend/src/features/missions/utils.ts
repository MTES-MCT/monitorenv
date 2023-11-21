import { sum } from 'lodash'

import { ActionTypeEnum, type Mission } from '../../domain/entities/missions'

export const getTotalOfControls = (mission: Partial<Mission>) =>
  sum(
    mission.envActions?.map(
      control => (control.actionType === ActionTypeEnum.CONTROL && control.actionNumberOfControls) || 0
    )
  )

export const getTotalOfSurveillances = (mission: Partial<Mission>) =>
  mission.envActions?.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE).length
