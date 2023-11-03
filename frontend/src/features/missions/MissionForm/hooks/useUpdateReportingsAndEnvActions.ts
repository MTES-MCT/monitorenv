import { useFormikContext } from 'formik'
import { useEffect, useMemo } from 'react'

import { ActionTypeEnum, type Mission } from '../../../../domain/entities/missions'

export const useUpdateReportingsAndEnvActions = () => {
  const { setFieldValue, values } = useFormikContext<Mission>()

  const envActionsFormUpdate = useMemo(() => {
    const updateEnvActions = attachedReportingToEnvActions => {
      const attachedReportingsId = attachedReportingToEnvActions.map(envAction => envAction.attachedReportingId)

      return values?.reportings?.map((reporting, index) => {
        if (!attachedReportingsId.includes(reporting.id)) {
          return setFieldValue(`reportings[${index}].attachedEnvActionId`, undefined)
        }
        const envAction = attachedReportingToEnvActions.find(action => action.attachedReportingId === reporting.id)

        return setFieldValue(`reportings[${index}].attachedEnvActionId`, envAction.id)
      })
    }

    return updateEnvActions
  }, [setFieldValue, values?.reportings])

  useEffect(() => {
    const attachedReportingToEnvActions = values?.envActions.filter(
      envAction =>
        (envAction.actionType === ActionTypeEnum.CONTROL || envAction.actionType === ActionTypeEnum.SURVEILLANCE) &&
        envAction.attachedReportingId
    )

    envActionsFormUpdate(attachedReportingToEnvActions)
  }, [values, envActionsFormUpdate])
}
