import React, { useRef } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import {  useField } from 'formik'


import { COLORS } from '../../../constants/constants'
import { actionTargetTypeEnum } from '../../../domain/entities/missions'

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

export const ActionTargetSelector = ({currentActionIndex, ...props}) => {
  const [actionTargetField, , actionTargetHelpers] = useField(`actions.${currentActionIndex}.actionTargetType`);
  const actionTargetSelectorRef = useRef()
  const actionTargetFieldList = Object.values(actionTargetTypeEnum)

  return (
    <SelectorWrapper ref={actionTargetSelectorRef}>
      <Form.ControlLabel htmlFor="actionTargetField">Type de cible : </Form.ControlLabel>
      <SelectPicker 
        style={DEFAULT_SELECT_PICKER_STYLE}
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        searchable={false}
        container={()=>actionTargetSelectorRef.current}
        value={actionTargetField.value}
        onChange={actionTargetHelpers.setValue}
        data={actionTargetFieldList}
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