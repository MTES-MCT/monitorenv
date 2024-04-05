import {
  ActionTypeEnum,
  CompletionStatus,
  FrontCompletionStatus,
  getMissionStatus,
  MissionStatusEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  type Mission
} from 'domain/entities/missions'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { ClosedEnvActionSchema } from '../Schemas'

export function useMissionAndActionsCompletion() {
  const { errors, values } = useFormikContext<Mission>()
  const missionStatus = getMissionStatus(values)
  const hasAtLeastOnUncompletedEnvAction = useMemo(
    () =>
      values.envActions.find(
        action =>
          (action.actionType === ActionTypeEnum.SURVEILLANCE || action.actionType === ActionTypeEnum.CONTROL) &&
          action.completion === CompletionStatus.TO_COMPLETE
      ),
    [values.envActions]
  )
  const hasAtLeastOnUncompletedFishAction = useMemo(
    () => values.fishActions.find(action => action.completion === CompletionStatus.TO_COMPLETE),
    [values.fishActions]
  )

  const isGeneralInformationsUncomplete = useMemo(
    () =>
      !!errors.startDateTimeUtc ??
      !!errors.endDateTimeUtc ??
      !!errors.missionTypes ??
      !!errors.openBy ??
      !!errors.controlUnits,
    [errors]
  )

  const missionCompletion =
    hasAtLeastOnUncompletedEnvAction || isGeneralInformationsUncomplete || hasAtLeastOnUncompletedFishAction
      ? CompletionStatus.TO_COMPLETE
      : CompletionStatus.COMPLETED

  const missionCompletionFrontStatus = useMemo(() => {
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
  }, [missionCompletion, missionStatus])

  const getActionsCompletion = useMemo(() => {
    const constrolOrSuveillanceActions = values.envActions.filter(
      action => action.actionType === ActionTypeEnum.CONTROL || action.actionType === ActionTypeEnum.SURVEILLANCE
    ) as (EnvActionControl | EnvActionSurveillance)[]

    return constrolOrSuveillanceActions.reduce((actionsMissingFieldsCollection, action) => {
      try {
        ClosedEnvActionSchema.validateSync(action, { abortEarly: false })

        return {
          ...actionsMissingFieldsCollection,
          [action.id]: 0
        }
      } catch (e: any) {
        // if schema has errors

        return {
          ...actionsMissingFieldsCollection,
          [action.id]: e.errors.length
        }
      }
    }, {})
  }, [values.envActions])

  return {
    actionsMissingFields: getActionsCompletion,
    missionCompletionFrontStatus
  }
}
