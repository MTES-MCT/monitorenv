import { customDayjs } from '@mtes-mct/monitor-ui'
import {
  type EnvActionControlWithInfractions,
  InfractionTypeEnum,
  type Mission,
  missionTypeEnum,
  type NewMission
} from 'domain/entities/missions'
import { sum, uniqBy } from 'lodash'

import {
  ActionTypeEnum,
  CompletionStatus,
  type EnvAction,
  FrontCompletionStatus,
  getMissionStatus,
  MissionStatusEnum
} from '../../domain/entities/missions'

export const getTotalOfControls = (envActions: Array<Partial<EnvAction>>) =>
  sum(
    envActions?.map(control => (control.actionType === ActionTypeEnum.CONTROL && control.actionNumberOfControls) || 0)
  )

export const getTotalOfSurveillances = (envActions: Array<Partial<EnvAction>>) =>
  envActions?.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE).length

export function getVesselName(vesselName) {
  return vesselName === 'UNKNOWN' ? 'Navire inconnu' : vesselName
}

export function hasAtLeastOnUncompletedEnvAction(envActions): boolean {
  return !!envActions?.find(
    action =>
      (action.actionType === ActionTypeEnum.SURVEILLANCE || action.actionType === ActionTypeEnum.CONTROL) &&
      action.completion === CompletionStatus.TO_COMPLETE
  )
}

export function getMissionCompletionFrontStatus(missionStatus, missionCompletion): FrontCompletionStatus | undefined {
  if (missionStatus === MissionStatusEnum.PENDING) {
    if (missionCompletion === CompletionStatus.COMPLETED) {
      return FrontCompletionStatus.UP_TO_DATE
    }

    return FrontCompletionStatus.TO_COMPLETE
  }

  if (missionStatus === MissionStatusEnum.ENDED) {
    if (missionCompletion === CompletionStatus.COMPLETED) {
      return FrontCompletionStatus.COMPLETED
    }

    return FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED
  }

  return undefined
}

export function getMissionCompletionStatus(mission) {
  const missionStatus = getMissionStatus(mission)
  const hasAtLeastOnUncompletedAction = hasAtLeastOnUncompletedEnvAction(mission.envActions)

  const missionCompletion = hasAtLeastOnUncompletedAction ? CompletionStatus.TO_COMPLETE : CompletionStatus.COMPLETED

  return getMissionCompletionFrontStatus(missionStatus, missionCompletion)
}

export function getIsMissionEnded(missionEndDate: string | undefined): boolean {
  if (!missionEndDate) {
    return false
  }
  const now = customDayjs()

  return !!missionEndDate && now.isAfter(missionEndDate)
}

export function getNewMissionTitle(values?: Partial<Mission> | Partial<NewMission>) {
  const hasControlUnitName = values?.controlUnits && values?.controlUnits.length > 0 && values?.controlUnits[0]?.name

  if (!hasControlUnitName) {
    return `Nouvelle mission`
  }

  return `Nouvelle mission - ${values?.controlUnits?.map(controlUnit => controlUnit.name).join(' - ')}`
}

export function getMissionTitle(values?: Partial<Mission> | Partial<NewMission>) {
  const missionTypes = values?.missionTypes?.map(missionType => missionTypeEnum[missionType].libelle).join(' / ')

  const controlUnitsNames = values?.controlUnits
    ?.map(controlUnit => controlUnit.name?.replace('(historique)', ''))
    .join(' - ')

  return `${values?.id} - Mission ${missionTypes} – ${controlUnitsNames}`
}

export function getIdTyped(id: string | undefined) {
  if (!id) {
    return undefined
  }

  return id.includes('new-') ? id : Number(id)
}

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

export function isMissionNew(id: string | number | undefined) {
  return id?.toString().includes('new') ?? false
}

export const getTotalInfraction = (envActions: EnvAction[] | EnvActionControlWithInfractions[], year?: number) => {
  let controls = envActions.filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)
  if (year) {
    controls = controls.filter(envAction => customDayjs(envAction.actionStartDateTimeUtc).year() === year)
  }

  return controls.reduce(
    (totalInfraction, control) =>
      totalInfraction + control.infractions.reduce((total, infraction) => total + infraction.nbTarget, 0),
    0
  )
}

export const getTotalPV = (envActions: EnvAction[] | EnvActionControlWithInfractions[], year?: number) => {
  let controls = envActions.filter(envAction => envAction.actionType === ActionTypeEnum.CONTROL)
  if (year) {
    controls = controls.filter(envAction => customDayjs(envAction.actionStartDateTimeUtc).year() === year)
  }

  return controls.reduce(
    (totalInfraction, control) =>
      totalInfraction +
      control.infractions.reduce((total, infraction) => {
        if (infraction.infractionType === InfractionTypeEnum.WITH_REPORT) {
          return total + infraction.nbTarget
        }

        return total
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
