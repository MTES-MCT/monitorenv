import { Mission } from '@features/Mission/mission.type'
import { useFormikContext } from 'formik'
import { useEffect, useMemo } from 'react'

export const useUpdateSurveillance = () => {
  const { setFieldValue, values } = useFormikContext<Mission.Mission>()

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
    const envActions = values.envActions ?? []

    const surveillances = envActions.filter(action => action.actionType === Mission.ActionTypeEnum.SURVEILLANCE)

    const surveillanceWithDurationMatchIndex = envActions.findIndex(
      action => action.actionType === Mission.ActionTypeEnum.SURVEILLANCE && action.durationMatchesMission
    )

    surveillanceFormUpdate(surveillances, surveillanceWithDurationMatchIndex)
  }, [values, surveillanceFormUpdate])
}
