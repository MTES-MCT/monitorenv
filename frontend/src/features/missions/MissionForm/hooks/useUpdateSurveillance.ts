import { useFormikContext } from 'formik'
import { useEffect, useMemo } from 'react'

import { ActionTypeEnum, type Mission } from '../../../../domain/entities/missions'

export const useUpdateSurveillance = () => {
  const { setFieldValue, values } = useFormikContext<Mission>()

  const surveillanceFormUpdate = useMemo(() => {
    const updateSurveillance = (surveillances, surveillanceWithDurationMatchIndex) => {
      if (surveillanceWithDurationMatchIndex && surveillanceWithDurationMatchIndex === -1) {
        return
      }
      if (surveillances?.length === 1) {
        setFieldValue(
          `envActions[${surveillanceWithDurationMatchIndex}].actionStartDateTimeUtc`,
          values?.startDateTimeUtc
        )
        setFieldValue(`envActions[${surveillanceWithDurationMatchIndex}].actionEndDateTimeUtc`, values?.endDateTimeUtc)
      }

      if (surveillances?.length > 1) {
        setFieldValue(`envActions[${surveillanceWithDurationMatchIndex}].durationMatchesMission`, false)
      }
    }

    return updateSurveillance
  }, [setFieldValue, values?.startDateTimeUtc, values?.endDateTimeUtc])

  useEffect(() => {
    const surveillances = values.envActions.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE)

    const surveillanceWithDurationMatchIndex = values.envActions.findIndex(
      action => action.actionType === ActionTypeEnum.SURVEILLANCE && action.durationMatchesMission
    )

    surveillanceFormUpdate(surveillances, surveillanceWithDurationMatchIndex)
  }, [values, surveillanceFormUpdate])
}
