import {
  getMissionCompletionFrontStatus,
  hasAtLeastOnUncompletedEnvAction,
  hasAtLeastOnUncompletedFishAction
} from '@features/missions/utils'
import {
  ActionTypeEnum,
  CompletionStatus,
  getMissionStatus,
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
  const hasAtLeastOnUncompletedAction = useMemo(
    () => hasAtLeastOnUncompletedEnvAction(values.envActions) || hasAtLeastOnUncompletedFishAction(values.fishActions),
    [values.envActions, values.fishActions]
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
    hasAtLeastOnUncompletedAction || isGeneralInformationsUncomplete
      ? CompletionStatus.TO_COMPLETE
      : CompletionStatus.COMPLETED

  const missionCompletionFrontStatus = useMemo(
    () => getMissionCompletionFrontStatus(missionStatus, missionCompletion),
    [missionCompletion, missionStatus]
  )

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
