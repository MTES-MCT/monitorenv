import { useField } from 'formik'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { vehicleTypeEnum } from '../../../../../../domain/entities/missions'
import { FormikInput } from '../../../../../../uiMonitor/CustomFormikFields/FormikInput'
import { VesselSizeSelector } from './VesselSizeSelector'
import { VesselTypeSelector } from './VesselTypeSelector'

export function InfractionFormHeaderVehicle({ currentActionIndex, infractionPath }) {
  const [vehicleTypeField] = useField(`envActions.${currentActionIndex}.vehicleType`)
  const [vesselTypeField, , vesselTypeHelpers] = useField(`${infractionPath}.vesselType`)
  const [vesselSizeField, , vesselSizeHelpers] = useField(`${infractionPath}.vesselSize`)
  const handleChangeVesselType = v => {
    vesselTypeHelpers.setValue(v)
  }
  const handleChangeVesselSize = v => {
    vesselSizeHelpers.setValue(v)
  }

  return (
    <FormGroup>
      <FormColumn>
        <Form.ControlLabel htmlFor={`${infractionPath}.registrationNumber`}>Immatriculation</Form.ControlLabel>
        <FormikInput name={`${infractionPath}.registrationNumber`} size="sm" />
      </FormColumn>
      {vehicleTypeField?.value === vehicleTypeEnum.VESSEL.code && (
        <>
          <FormColumn>
            <VesselTypeSelector onChange={handleChangeVesselType} value={vesselTypeField.value} />
          </FormColumn>

          <FormColumn>
            <VesselSizeSelector onChange={handleChangeVesselSize} value={vesselSizeField.value} />
          </FormColumn>
        </>
      )}
    </FormGroup>
  )
}

const FormColumn = styled.div`
  display: inline-block;
  :not(:last-child) {
    margin-right: 6px;
  }
`
const FormGroup = styled.div`
  margin-bottom: 16px;
  height: 58px;
  display: flex;
`
