import { ControlUnit, usePrevious } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { ActionTypeEnum, type Mission } from '../../../../../domain/entities/missions'

export const useUpdateOtherControlTypes = () => {
  const {
    setFieldValue,
    values: { controlUnits, envActions }
  } = useFormikContext<Mission>()

  const currentControlUnitIsPAMOrULAM = controlUnits?.some(
    controlUnit =>
      ControlUnit.PAMControlUnitIds.includes(controlUnit.id) || ControlUnit.ULAMControlUnitIds.includes(controlUnit.id)
  )

  const previousControlUnitIsPAM = usePrevious(currentControlUnitIsPAMOrULAM)

  // if control unit is not changed, do nothing
  if (previousControlUnitIsPAM === undefined) {
    return
  }

  if (previousControlUnitIsPAM && !currentControlUnitIsPAMOrULAM) {
    envActions.forEach((action, index) => {
      if (action.actionType === ActionTypeEnum.CONTROL) {
        // to prevent multiple form update (control Unit and envActions)
        setTimeout(() => {
          setFieldValue(`envActions[${index}].isAdministrativeControl`, undefined, false)
          setFieldValue(`envActions[${index}].isComplianceWithWaterRegulationsControl`, undefined, false)
          setFieldValue(`envActions[${index}].isSafetyEquipmentAndStandardsComplianceControl`, undefined, false)
          setFieldValue(`envActions[${index}].isSeafarersControl`, undefined, false)
        }, 100)
      }
    })
  }
  if (!previousControlUnitIsPAM && currentControlUnitIsPAMOrULAM) {
    envActions.forEach((action, index) => {
      if (action.actionType === ActionTypeEnum.CONTROL) {
        // to prevent multiple form update (control Unit and envActions)
        setTimeout(() => {
          setFieldValue(`envActions[${index}].isAdministrativeControl`, false, false)
          setFieldValue(`envActions[${index}].isComplianceWithWaterRegulationsControl`, false, false)
          setFieldValue(`envActions[${index}].isSafetyEquipmentAndStandardsComplianceControl`, false, false)
          setFieldValue(`envActions[${index}].isSeafarersControl`, false, false)
        }, 100)
      }
    })
  }
}
