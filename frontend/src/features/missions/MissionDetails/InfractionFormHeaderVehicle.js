import { useField } from 'formik'
import React from 'react'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { vehicleTypeEnum } from '../../../domain/entities/missions'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { VesselSizeSelector } from './VesselSizeSelector'
import { VesselTypeSelector } from './VesselTypeSelector'

export function InfractionFormHeaderVehicle({ currentActionIndex, infractionPath }) {
  const [vehicleTypeField] = useField(`envActions.${currentActionIndex}.vehicleType`)

  return (
    <FormGroup>
      <FormColumn>
        <Form.ControlLabel htmlFor={`${infractionPath}.registrationNumber`}>Immatriculation</Form.ControlLabel>
        <FormikInput name={`${infractionPath}.registrationNumber`} size="sm" />
      </FormColumn>
      {vehicleTypeField?.value === vehicleTypeEnum.VESSEL.code && (
        <>
          <FormColumn>
            <VesselTypeSelector currentActionIndex={currentActionIndex} infractionPath={infractionPath} />
          </FormColumn>

          <FormColumn>
            <VesselSizeSelector currentActionIndex={currentActionIndex} infractionPath={infractionPath} />
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
