import { customDayjs } from '@mtes-mct/monitor-ui'
import { missionTypeEnum, type Mission, type NewMission } from 'domain/entities/missions'
import { sum } from 'lodash'

import {
  ActionTypeEnum,
  CompletionStatus,
  FrontCompletionStatus,
  getMissionStatus,
  MissionStatusEnum,
  type EnvAction
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
