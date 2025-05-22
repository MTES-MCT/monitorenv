import { uniq } from 'lodash'

import { ActionTypeEnum, InfractionTypeEnum, type Mission } from '../../../../../domain/entities/missions'

export const getTotalInfraction = (missions: Mission[]) => {
  const controls = missions
    .flatMap(mission => mission.envActions)
    .filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)

  return controls.reduce(
    (totalInfraction, control) =>
      totalInfraction + control.infractions.reduce((sum, infraction) => sum + infraction.nbTarget, 0),
    0
  )
}

export const getTotalPV = (missions: Mission[]) => {
  const controls = missions
    .flatMap(mission => mission.envActions)
    .filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)

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

export const getTotalNbControls = (missions: Mission[]) => {
  const controls = missions
    .flatMap(mission => mission.envActions)
    .filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)

  return controls.reduce((totalInfraction, control) => totalInfraction + (control.actionNumberOfControls ?? 0), 0)
}

export const getAllThemes = (missions: Mission[]) => {
  const controlsAndSurveillances = missions
    .flatMap(mission => mission.envActions)
    .filter(
      envAction =>
        envAction.actionType === ActionTypeEnum.CONTROL || envAction.actionType === ActionTypeEnum.SURVEILLANCE
    )

  return uniq(controlsAndSurveillances.flatMap(action => action.themes ?? []))
}
