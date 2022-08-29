import React from 'react'
import styled from 'styled-components'
import { Form } from 'rsuite'
import {  useField } from 'formik'
import { VesselSizeSelector } from './VesselSizeSelector'
import { VesselTypeSelector } from './VesselTypeSelector'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'
import { vehicleTypeEnum } from '../../../domain/entities/missions'


export const InfractionFormHeaderVehicle = ({currentActionIndex, infractionPath}) => {
  const [vehicleTypeField] = useField(`envActions.${currentActionIndex}.vehicleType`)
  console.log(vehicleTypeField?.value)
  return (
    <FormGroup>
      <FormColumn>
        <Form.ControlLabel htmlFor={`${infractionPath}.registrationNumber`}>Immatriculation</Form.ControlLabel>
        <FormikInput size='sm' name={`${infractionPath}.registrationNumber`} />
      </FormColumn>
      {
        vehicleTypeField?.value === vehicleTypeEnum.VESSEL.code &&
        <>
          <FormColumn>
            <VesselTypeSelector infractionPath={infractionPath} currentActionIndex={currentActionIndex}/>
          </FormColumn>
        
          <FormColumn>
            <VesselSizeSelector infractionPath={infractionPath} currentActionIndex={currentActionIndex}/>
          </FormColumn>
        </>
      }
    </FormGroup>
  )
}

const FormColumn = styled.div`
  display: inline-block;
  :not(:last-child) {
    margin-right: 6px;
  }
`
const FormGroup = styled(Form.Group)`
  height: 58px;
  display: flex;
`