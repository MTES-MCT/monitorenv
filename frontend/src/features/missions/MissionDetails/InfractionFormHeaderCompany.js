import React from 'react'
import styled from 'styled-components'
import { Form } from 'rsuite'
import { Field } from 'formik'

export const InfractionFormHeaderCompany = ({infractionPath}) => {
  return (
    <Form.Group>
      <FormColumn>
        <Form.ControlLabel htmlFor={`${infractionPath}.companyName`}>Nom de la société</Form.ControlLabel>
        <Field name={`${infractionPath}.companyName`} />
      </FormColumn>    
    </Form.Group>
  )
}

const FormColumn = styled.div`
  display: inline-block;
  ${props => `flex: ${props.flex};`}
`