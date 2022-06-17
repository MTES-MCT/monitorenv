import React, { useRef } from 'react'
import _ from 'lodash'
import styled from 'styled-components';
import { Form, SelectPicker, CheckPicker } from 'rsuite';
import {  useField } from 'formik';

import { useGetControlResourcesQuery } from '../../../api/controlResourcesAPI'

export const ControlResourcesSelector = ({ ...props }) => {
  const [administrationField, , administrationHelpers] = useField("administration");
  const [unitField, , unitHelpers] = useField("unit");
  const [resourcesField, , resourcesHelpers] = useField("resources");

  const selectorRef = useRef()
  const { data, isError, isLoading } = useGetControlResourcesQuery()

  const administrationList = _.uniqBy(data, 'administration')
  const unitList = _.uniqBy(_.filter(data, r => r.administration === administrationField.value), 'unit')
  const resourcesList = _.filter(data, r => r.administration === administrationField.value && r.unit === unitField.value)

  const handleAdministrationChange = (value) => {
    if (value !== administrationField.value) {
      administrationHelpers.setValue(value)
      unitHelpers.setValue('')
      resourcesHelpers.setValue([])
    }
  }
  const handleUnitChange = (value) => {
    if (value !== unitField.value) {
      unitHelpers.setValue(value)
      resourcesHelpers.setValue([])
    }
  }

  if (isError) {
    return ('Erreur')
  }
  if (isLoading) {
    return ('Chargement')
  }
  return (
    <SelectorWrapper ref={selectorRef}>
      <Form.Group>
        <Form.ControlLabel htmlFor="administration">Administration : </Form.ControlLabel>
        <SelectPicker 
          container={()=>selectorRef.current}
          value={administrationField.value}
          onChange={handleAdministrationChange}
          data={administrationList}
          labelKey={'administration'}
          valueKey={'administration'}
          {...props} />
        <Form.ControlLabel htmlFor="unit">Unité : </Form.ControlLabel>
        <SelectPicker 
          container={()=>selectorRef.current} 
          value={unitField.value} 
          onChange={handleUnitChange} 
          data={unitList} 
          labelKey={'unit'}
          valueKey={'unit'}
          disabled={_.isEmpty(administrationField.value)}
          {...props} />
        <Form.ControlLabel htmlFor="resources">Moyens : </Form.ControlLabel>
        <CheckPicker
          container={()=>selectorRef.current}
          value={resourcesField.value}
          onChange={resourcesHelpers.setValue}
          data={resourcesList}
          labelKey={'resource_name'}
          valueKey={'resource_name'}
          disabled={_.isEmpty(unitField.value)}
          {...props} />
      </Form.Group>
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
`
