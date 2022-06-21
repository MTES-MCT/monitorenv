import React, { useRef } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import {  useField } from 'formik'


import { COLORS } from '../../../constants/constants'
import { vesselSizeEnum } from '../../../domain/entities/missions'

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

export const VesselSizeSelector = ({name, ...props}) => {
  const [vesselSizeField, , vesselSizeHelpers] = useField(name);
  const vesselSizeSelectorRef = useRef()
  const vesselSizeFieldList = Object.values(vesselSizeEnum)

  return (
    <SelectorWrapper ref={vesselSizeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselSizeField">Taille : </Form.ControlLabel>
      <SelectPicker 
        style={DEFAULT_SELECT_PICKER_STYLE}
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        searchable={false}
        container={()=>vesselSizeSelectorRef.current}
        value={vesselSizeField.value}
        onChange={vesselSizeHelpers.setValue}
        data={vesselSizeFieldList}
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