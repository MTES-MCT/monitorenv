import React from 'react'
import { Form } from 'rsuite'
import styled from 'styled-components'
import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'

export const InfractionFormHeaderCompany = ({infractionPath}) => {
  return (
    <SubGroup>
        <Form.ControlLabel htmlFor={`${infractionPath}.companyName`}>Nom de la société</Form.ControlLabel>
        <FormikInput size='sm' name={`${infractionPath}.companyName`} />
    </SubGroup>
  )
}

const SubGroup = styled.div`
  margin-bottom: 16px;
`