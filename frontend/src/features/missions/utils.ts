import { sum } from 'lodash'

import {
  ActionTypeEnum,
  CompletionStatus,
  FrontCompletionStatus,
  getMissionStatus,
  MissionStatusEnum,
  type Mission,
  type NewMission
} from '../../domain/entities/missions'

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

export function hasAtLeastOnUncompletedEnvAction(envActions): boolean {
  return !!envActions.find(
    action =>
      (action.actionType === ActionTypeEnum.SURVEILLANCE || action.actionType === ActionTypeEnum.CONTROL) &&
      action.completion === CompletionStatus.TO_COMPLETE
  )
}
export function hasAtLeastOnUncompletedFishAction(fishActions): boolean {
  return !!fishActions.find(action => action.completion === CompletionStatus.TO_COMPLETE)
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
  const hasAtLeastOnUncompletedAction = hasAtLeastOnUncompletedEnvAction(
    mission.envActions
  ) /*  || hasAtLeastOnUncompletedFishAction(mission.fishActions) */

  const missionCompletion = hasAtLeastOnUncompletedAction ? CompletionStatus.TO_COMPLETE : CompletionStatus.COMPLETED

  return getMissionCompletionFrontStatus(missionStatus, missionCompletion)
}
