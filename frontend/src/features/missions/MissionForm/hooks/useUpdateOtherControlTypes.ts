import { usePrevious } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { ControlUnit } from '../../../../domain/entities/controlUnit'
import { ActionTypeEnum, type Mission } from '../../../../domain/entities/missions'

export const useUpdateOtherControlTypes = () => {
  const {
    setFieldValue,
    values: { controlUnits, envActions }
  } = useFormikContext<Mission>()

  const currentControlUnitIsPAM = controlUnits.some(controlUnit =>
    ControlUnit.PAMControlUnitIds.includes(controlUnit.id)
  )
  const previousControlUnitIsPAM = usePrevious(currentControlUnitIsPAM)

  if (previousControlUnitIsPAM && !currentControlUnitIsPAM) {
    envActions.forEach((action, index) => {
      if (action.actionType === ActionTypeEnum.CONTROL) {
        setFieldValue(`envActions[${index}].isAdministrativeControl`, null, false)
        setFieldValue(`envActions[${index}].isComplianceWithWaterRegulationsControl`, null, false)
        setFieldValue(`envActions[${index}].isSafetyEquipmentAndStandardsComplianceControl`, null, false)
        setFieldValue(`envActions[${index}].isSeafarersControl`, null, false)
      }
    })
  }
  if (!previousControlUnitIsPAM && currentControlUnitIsPAM) {
    envActions.forEach((action, index) => {
      if (action.actionType === ActionTypeEnum.CONTROL) {
        setFieldValue(`envActions[${index}].isAdministrativeControl`, false, false)
        setFieldValue(`envActions[${index}].isComplianceWithWaterRegulationsControl`, false, false)
        setFieldValue(`envActions[${index}].isSafetyEquipmentAndStandardsComplianceControl`, false, false)
        setFieldValue(`envActions[${index}].isSeafarersControl`, false, false)
      }
    })
  }
}
