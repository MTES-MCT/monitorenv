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
import { TargetTypeEnum } from 'domain/entities/targetType'
import { useFormikContext, type FormikErrors } from 'formik'
import { useEffect, useMemo, useState } from 'react'

export function useMissionAndActionsCompletion() {
  const { errors, setFieldValue, values } = useFormikContext<Mission>()
  const [actionsMissingFields, setActionsMissingFields] = useState({})
  const missionStatus = getMissionStatus(values)
  const hasAtLeastOnUncompletedAction = values.envActions.find(
    action =>
      (action.actionType === ActionTypeEnum.SURVEILLANCE || action.actionType === ActionTypeEnum.CONTROL) &&
      action.completion === CompletionStatus.TO_COMPLETE
  )

  const isGeneralInformationsUncomplete =
    errors.startDateTimeUtc ?? errors.endDateTimeUtc ?? errors.missionTypes ?? errors.openBy ?? errors.controlUnits

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
    const constrolOrSuveillanceActions = values.envActions.filter(
      action => action.actionType === ActionTypeEnum.CONTROL || action.actionType === ActionTypeEnum.SURVEILLANCE
    ) as (EnvActionControl | EnvActionSurveillance)[]

    const missingFieldsWithActionId = constrolOrSuveillanceActions.reduce(
      (actionsMissingFieldsCollection, action, index) => {
        const actionErrors = errors.envActions
          ? (errors.envActions[index] as FormikErrors<EnvActionControl | EnvActionSurveillance>)
          : undefined

        // common required fields
        const isGeomValid = !!(action.geom && action.geom.coordinates.length > 0)
        const isStartDateValid = !!(action.actionStartDateTimeUtc && !actionErrors?.actionStartDateTimeUtc)
        const isSubThemeValid = !!(
          action.controlPlans?.length > 0 &&
          action.controlPlans[0] &&
          action.controlPlans[0]?.subThemeIds?.length > 0
        )
        const isThemeValid = !!(action.controlPlans?.length > 0 && action.controlPlans[0]?.themeId)

        const commonMissingActionFields: Array<Boolean> = [
          !isStartDateValid,
          !isThemeValid,
          !isSubThemeValid,
          !isGeomValid
        ]

        let actionSpecificMissingFields: Array<Boolean> = []
        // Control Action
        if (action.actionType === ActionTypeEnum.CONTROL) {
          const isNumberOfControlsValid = !!(action.actionNumberOfControls && action.actionNumberOfControls > 0)
          const isTargetTypeValid = !!action.actionTargetType
          const isVehicleTypeValid =
            action.actionTargetType && action.actionTargetType === TargetTypeEnum.VEHICLE ? !!action.vehicleType : true

          actionSpecificMissingFields = [
            ...commonMissingActionFields,
            !isNumberOfControlsValid,
            !isTargetTypeValid,
            !isVehicleTypeValid
          ]
        }

        // Surveillance action
        if (action.actionType === ActionTypeEnum.SURVEILLANCE) {
          const isEndDateValid = !!(action.actionEndDateTimeUtc && !actionErrors?.actionEndDateTimeUtc)
          actionSpecificMissingFields = [...commonMissingActionFields, !isEndDateValid]
        }

        const missingFieldsLength = actionSpecificMissingFields.filter(missingField => missingField).length
        const icActionValid = missingFieldsLength === 0
        if (icActionValid && action.completion === CompletionStatus.TO_COMPLETE) {
          setFieldValue(`envActions[${index}].completion`, CompletionStatus.COMPLETED)
        }

        if (!icActionValid && action.completion === CompletionStatus.COMPLETED) {
          setFieldValue(`envActions[${index}].completion`, CompletionStatus.TO_COMPLETE)
        }

        return {
          ...actionsMissingFieldsCollection,
          [action.id]: missingFieldsLength
        }
      },
      {}
    )

    setActionsMissingFields(missingFieldsWithActionId)

    // we don't need to listen the actionsMissingFields updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.envActions, missionCompletion, setFieldValue, errors.envActions])

  return {
    actionsMissingFields,
    missionCompletionFrontStatus
  }
}
