import { useFormikContext } from 'formik'
import { useCallback, useEffect, useMemo } from 'react'

import { ActionTypeEnum, type Mission } from '../../../../domain/entities/missions'

export const useUpdateSurveillance = () => {
  const { setFieldValue, values } = useFormikContext<Mission>()

  const surveillances = useMemo(
    () =>
      (values.envActions as Array<Record<string, any>>).filter(
        action => action.actionType === ActionTypeEnum.SURVEILLANCE
      ),
    [values.envActions]
  )
  const surveillanceWithDurationMatchIndex = useMemo(
    () =>
      values.envActions.findIndex(
        action => action.actionType === ActionTypeEnum.SURVEILLANCE && action.durationMatchesMission
      ),
    [values.envActions]
  )
  const dispatchFormUpdate = useCallback(() => {
    if (surveillances.length === 1 && surveillances[0]?.durationMatchesMission) {
      setFieldValue(
        `envActions[${surveillanceWithDurationMatchIndex}].actionStartDateTimeUtc`,
        values?.startDateTimeUtc
      )
      setFieldValue(`envActions[${surveillanceWithDurationMatchIndex}].actionEndDateTimeUtc`, values?.endDateTimeUtc)
    }

    if (surveillances.length > 1) {
      setFieldValue(`envActions[${surveillanceWithDurationMatchIndex}].actionStartDateTimeUtc`, null)
      setFieldValue(`envActions[${surveillanceWithDurationMatchIndex}].actionEndDateTimeUtc`, null)
    }
  }, [
    surveillances,
    surveillanceWithDurationMatchIndex,
    setFieldValue,
    values?.startDateTimeUtc,
    values?.endDateTimeUtc
  ])

  useEffect(() => {
    dispatchFormUpdate()

    return () => dispatchFormUpdate()
  }, [values, dispatchFormUpdate])
}
