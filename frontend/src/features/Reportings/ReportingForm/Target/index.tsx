import { getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { FieldArray, useFormikContext } from 'formik'

import { TargetDetails } from './TargetDetails'
import { ReportingTargetTypeLabels, ReportingTargetTypeEnum } from '../../../../domain/entities/targetType'
import { TargetSelector } from '../../../commonComponents/TargetSelector'
import { VehicleTypeSelector } from '../../../commonComponents/VehicleTypeSelector'
import { StyledInlineContainer } from '../../style'

import type { Reporting } from '../../../../domain/entities/reporting'

export function Target() {
  const { setFieldValue, values } = useFormikContext<Reporting>()

  const targetTypeOptions = getOptionsFromLabelledEnum(ReportingTargetTypeLabels)

  const onTargetTypeChange = selectedTarget => {
    setFieldValue('targetType', selectedTarget)
    setFieldValue('vehicleType', undefined)
    setFieldValue('targetDetails', [])
  }
  const onVehicleTypeChange = selectedVehicleType => {
    setFieldValue('vehicleType', selectedVehicleType)
    setFieldValue('targetDetails', [{}])
  }

  return (
    <>
      <StyledInlineContainer>
        <TargetSelector
          dataCy="reporting-target-type"
          name="targetType"
          onChange={onTargetTypeChange}
          options={targetTypeOptions}
          value={values.targetType}
        />
        <VehicleTypeSelector
          dataCy="reporting-vehicle-type"
          disabled={values.targetType !== ReportingTargetTypeEnum.VEHICLE}
          name="vehicleType"
          onChange={onVehicleTypeChange}
          value={values.vehicleType}
        />
      </StyledInlineContainer>

      <FieldArray
        name="targetDetails"
        render={({ form, push, remove }) => <TargetDetails form={form} push={push} remove={remove} />}
        validateOnChange={false}
      />
    </>
  )
}
