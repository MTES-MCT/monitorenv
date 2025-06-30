import { uniqBy } from 'lodash'

import { ActionTypeEnum, type EnvAction, InfractionTypeEnum } from '../../../../../domain/entities/missions'

export const getTotalInfraction = (envActions: EnvAction[]) => {
  const controls = envActions.filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)

  return controls.reduce(
    (totalInfraction, control) =>
      totalInfraction + control.infractions.reduce((sum, infraction) => sum + infraction.nbTarget, 0),
    0
  )
}

export const getTotalPV = (envActions: EnvAction[]) => {
  const controls = envActions.filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)

  return controls.reduce(
    (totalInfraction, control) =>
      totalInfraction +
      control.infractions.reduce((sum, infraction) => {
        if (infraction.infractionType === InfractionTypeEnum.WITH_REPORT) {
          return sum + infraction.nbTarget
        }

        return sum
      }, 0),
    0
  )
}

export const getTotalNbControls = (envActions: EnvAction[]) => {
  const controls = envActions.filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)

  return controls.reduce((totalInfraction, control) => totalInfraction + (control.actionNumberOfControls ?? 0), 0)
}

export const getAllThemes = (envActions: EnvAction[]) => {
  const controlsAndSurveillances = envActions.filter(
    envAction => envAction.actionType === ActionTypeEnum.CONTROL || envAction.actionType === ActionTypeEnum.SURVEILLANCE
  )

  return uniqBy(
    controlsAndSurveillances.flatMap(action => action.themes ?? []),
    'id'
  )
}
