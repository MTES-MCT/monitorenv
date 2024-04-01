import {
  ActionTypeEnum,
  CompletionStatus,
  FrontCompletionStatus,
  getMissionStatus,
  MissionStatusEnum,
  type Mission
} from 'domain/entities/missions'
import { TargetTypeEnum } from 'domain/entities/targetType'
import { useFormikContext } from 'formik'
import { useEffect, useMemo } from 'react'

export function useMissionAndActionsCompletion() {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const missionStatus = getMissionStatus(values)
  const hasAtLeastOnUncompletedAction = values.envActions.find(
    action =>
      (action.actionType === ActionTypeEnum.SURVEILLANCE || action.actionType === ActionTypeEnum.CONTROL) &&
      action.completion === CompletionStatus.TO_COMPLETE
  )

  const isGeneralInformationsUncomplete =
    !values.startDateTimeUtc ||
    !values.endDateTimeUtc ||
    !values.missionTypes ||
    !values.openBy ||
    !values.controlUnits ||
    !values.controlUnits[0]?.id

  const missionCompletion =
    hasAtLeastOnUncompletedAction || isGeneralInformationsUncomplete
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

  useEffect(() => {
    values.envActions.forEach((action, index) => {
      if (action.actionType === ActionTypeEnum.CONTROL) {
        const isControlValid =
          action.actionStartDateTimeUtc &&
          action.actionNumberOfControls &&
          action.actionTargetType &&
          action.controlPlans.length > 0 &&
          action.controlPlans[0]?.themeId &&
          action.controlPlans[0]?.subThemeIds.length > 0 &&
          action.geom &&
          action.geom.coordinates.length > 0

        const isVehiculeTypeValid =
          !action.actionTargetType || action.actionTargetType === TargetTypeEnum.VEHICLE ? action.vehicleType : true

        if (isControlValid && isVehiculeTypeValid && action.completion === CompletionStatus.TO_COMPLETE) {
          setFieldValue(`envActions[${index}].completion`, CompletionStatus.COMPLETED)
        }
        if ((!isControlValid || !isVehiculeTypeValid) && action.completion === CompletionStatus.COMPLETED) {
          setFieldValue(`envActions[${index}].completion`, CompletionStatus.TO_COMPLETE)
        }
      } else if (action.actionType === ActionTypeEnum.SURVEILLANCE) {
        const isSurveillanceValid =
          action.actionStartDateTimeUtc &&
          action.actionEndDateTimeUtc &&
          action.controlPlans.length > 0 &&
          action.controlPlans[0]?.themeId &&
          action.controlPlans[0]?.subThemeIds.length > 0 &&
          action.geom &&
          action.geom.coordinates.length > 0

        if (isSurveillanceValid && action.completion === CompletionStatus.TO_COMPLETE) {
          setFieldValue(`envActions[${index}].completion`, CompletionStatus.COMPLETED)
        }

        if (!isSurveillanceValid && action.completion === CompletionStatus.COMPLETED) {
          setFieldValue(`envActions[${index}].completion`, CompletionStatus.TO_COMPLETE)
        }
      }
    })
  }, [values.envActions, missionCompletion, setFieldValue])

  return missionCompletionFrontStatus
}
