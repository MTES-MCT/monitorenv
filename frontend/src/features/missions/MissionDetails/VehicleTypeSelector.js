import React, { useRef } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import {  useField } from 'formik'


import { COLORS } from '../../../constants/constants'
import { vehicleTypeEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 90,
  margin: '0',
  borderColor: COLORS.lightGray,
  boxSizing: 'border-box',
  textOverflow: 'ellipsis'
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = { 
  width: 150,
  overflowY: 'hidden',
  textOverflow: 'ellipsis'
}

export const VehicleTypeSelector = ({name, ...props}) => {
  const [vehicleTypeField, , vehicleTypeHelpers] = useField(name);
  const vehicleTypeSelectorRef = useRef()
  const vehicleTypeFieldList = Object.values(vehicleTypeEnum)

  return (
    <SelectorWrapper ref={vehicleTypeSelectorRef}>
      <Form.ControlLabel htmlFor="vehicleTypeField">Type de véhicule : </Form.ControlLabel>
      <SelectPicker 
        style={DEFAULT_SELECT_PICKER_STYLE}
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        searchable={false}
        container={()=>vehicleTypeSelectorRef.current}
        value={vehicleTypeField.value}
        onChange={vehicleTypeHelpers.setValue}
        data={vehicleTypeFieldList}
        labelKey={'libelle'}
        valueKey={'code'}
        {...props} />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  width: 150px;
  .rs-picker-menu {
    position: relative;
    margin-top: -50px;
  }
`