import { customDayjs } from '@mtes-mct/monitor-ui'
import { sum } from 'lodash'

import { Mission } from './mission.type'

export const getMissionStatus = ({
  endDateTimeUtc,
  startDateTimeUtc
}: {
  endDateTimeUtc?: string | null
  startDateTimeUtc?: string | null
}) => {
  if (!startDateTimeUtc) {
    return 'ERROR'
  }

  const now = customDayjs()

  if (customDayjs(startDateTimeUtc).isAfter(now)) {
    return Mission.MissionStatusEnum.UPCOMING
  }

  if (endDateTimeUtc && customDayjs(endDateTimeUtc).isBefore(now)) {
    return Mission.MissionStatusEnum.ENDED
  }

  return Mission.MissionStatusEnum.PENDING
}

export const getTotalOfControls = (envActions: Array<Partial<Mission.EnvAction>>) =>
  sum(
    envActions?.map(
      control => (control.actionType === Mission.ActionTypeEnum.CONTROL && control.actionNumberOfControls) || 0
    )
  )

export const getTotalOfSurveillances = (envActions: Array<Partial<Mission.EnvAction>>) =>
  envActions?.filter(action => action.actionType === Mission.ActionTypeEnum.SURVEILLANCE).length

export function getVesselName(vesselName) {
  return vesselName === 'UNKNOWN' ? 'Navire inconnu' : vesselName
}

export function hasAtLeastOnUncompletedEnvAction(envActions): boolean {
  return !!envActions?.find(
    action =>
      (action.actionType === Mission.ActionTypeEnum.SURVEILLANCE ||
        action.actionType === Mission.ActionTypeEnum.CONTROL) &&
      action.completion === Mission.CompletionStatus.TO_COMPLETE
  )
}

export function getMissionCompletionFrontStatus(
  missionStatus,
  missionCompletion
): Mission.FrontCompletionStatus | undefined {
  if (missionStatus === Mission.MissionStatusEnum.PENDING) {
    if (missionCompletion === Mission.CompletionStatus.COMPLETED) {
      return Mission.FrontCompletionStatus.UP_TO_DATE
    }

    return Mission.FrontCompletionStatus.TO_COMPLETE
  }

  if (missionStatus === Mission.MissionStatusEnum.ENDED) {
    if (missionCompletion === Mission.CompletionStatus.COMPLETED) {
      return Mission.FrontCompletionStatus.COMPLETED
    }

    return Mission.FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED
  }

  return undefined
}

export function getMissionCompletionStatus(mission) {
  const missionStatus = getMissionStatus(mission)
  const hasAtLeastOnUncompletedAction = hasAtLeastOnUncompletedEnvAction(mission.envActions)

  const missionCompletion = hasAtLeastOnUncompletedAction
    ? Mission.CompletionStatus.TO_COMPLETE
    : Mission.CompletionStatus.COMPLETED

  return getMissionCompletionFrontStatus(missionStatus, missionCompletion)
}

export function getIsMissionEnded(missionEndDate: string | undefined): boolean {
  if (!missionEndDate) {
    return false
  }
  const now = customDayjs()

  return !!missionEndDate && now.isAfter(missionEndDate)
}
