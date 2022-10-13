import React from 'react'
import { Form } from 'rsuite'
import styled from 'styled-components'

import { FormikInput } from '../../../uiMonitor/CustomFormikFields/FormikInput'

export function InfractionFormHeaderCompany({ infractionPath }) {
  return (
    <SubGroup>
      <Form.ControlLabel htmlFor={`${infractionPath}.companyName`}>Nom de la société</Form.ControlLabel>
      <FormikInput name={`${infractionPath}.companyName`} size="sm" />
    </SubGroup>
  )
}

const SubGroup = styled.div`
  margin-bottom: 16px;
`
