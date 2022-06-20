import React, { useRef } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Form, SelectPicker, TagPicker } from 'rsuite'
import {  useField } from 'formik'


import { useGetControlResourcesQuery } from '../../../api/controlResourcesAPI'
import { COLORS } from '../../../constants/constants'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 130,
  margin: '0',
  borderColor: COLORS.lightGray,
  boxSizing: 'border-box',
  textOverflow: 'ellipsis'
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = { 
  width: 190,
  overflowY: 'hidden',
  textOverflow: 'ellipsis'
}


export const ControlResourcesSelector = ({ ...props }) => {
  const [administrationField, , administrationHelpers] = useField("administration");
  const [unitField, , unitHelpers] = useField("unit");
  const [resourcesField, , resourcesHelpers] = useField("resources");

  const administrationSelectorRef = useRef()
  const unitSelectorRef = useRef()
  const resourcesRef = useRef()
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
    <SelectorWrapper >
      <Form.Group>
        <FormColumn ref={administrationSelectorRef}>
          <Form.ControlLabel htmlFor="administration">Administration : </Form.ControlLabel>
          <SelectPicker 
            style={DEFAULT_SELECT_PICKER_STYLE}
            menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
            searchable={false}
            container={()=>administrationSelectorRef.current}
            value={administrationField.value}
            onChange={handleAdministrationChange}
            data={administrationList}
            labelKey={'administration'}
            valueKey={'administration'}
            {...props} />
        </FormColumn>
        <FormColumn ref={unitSelectorRef}>
          <Form.ControlLabel htmlFor="unit">Unité : </Form.ControlLabel>
          <SelectPicker 
            style={DEFAULT_SELECT_PICKER_STYLE}
            menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
            searchable={false}
            container={()=>unitSelectorRef.current} 
            value={unitField.value} 
            onChange={handleUnitChange} 
            data={unitList} 
            labelKey={'unit'}
            valueKey={'unit'}
            disabled={_.isEmpty(administrationField.value)}
            {...props} />
        </FormColumn>
      </Form.Group>
      <Form.Group>
        <RefWrapper ref={resourcesRef} data-cy={'unit-tag-picker'}>
          <Form.ControlLabel htmlFor="resources">Moyens : </Form.ControlLabel>
          <TagPicker
            block
            cleanable={false}
            container={()=>resourcesRef.current}
            value={resourcesField.value}
            onChange={resourcesHelpers.setValue}
            data={resourcesList}
            labelKey={'resource_name'}
            valueKey={'resource_name'}
            disabled={_.isEmpty(unitField.value)}
            {...props} />
        </RefWrapper>
      </Form.Group>
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  .rs-picker-select-menu {
    position: relative;
    margin-top: -50px;
  }
`

const FormColumn = styled.div`
  display: inline-block;
  width: 240px;
  vertical-align: top;
`
const RefWrapper = styled.div`
  .rs-picker-menu {
    position: relative;
    margin-top: -60px;
  }
`