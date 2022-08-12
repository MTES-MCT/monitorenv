import React from 'react'
import styled from 'styled-components'
import { Form } from 'rsuite'
import { Field } from 'formik'

import { VesselSizeSelector } from './VesselSizeSelector'
import { VesselTypeSelector } from './VesselTypeSelector'


export const InfractionFormHeaderVehicle = ({currentActionIndex, infractionPath}) => {
  return (
    <Form.Group>
      <FormColumn>
        <Form.ControlLabel htmlFor={`${infractionPath}.registrationNumber`}>Immatriculation</Form.ControlLabel>
        <Field name={`${infractionPath}.registrationNumber`} />
      </FormColumn>
    
      <FormColumn>
        <VesselTypeSelector infractionPath={infractionPath} currentActionIndex={currentActionIndex}/>
      </FormColumn>
    
      <FormColumn>
        <VesselSizeSelector infractionPath={infractionPath} currentActionIndex={currentActionIndex}/>
      </FormColumn>
    </Form.Group>
  )
}

const FormColumn = styled.div`
  display: inline-block;
  ${props => `flex: ${props.flex};`}
`