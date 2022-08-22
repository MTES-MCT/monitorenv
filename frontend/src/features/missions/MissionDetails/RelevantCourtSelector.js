import React, { useRef } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import {  useField } from 'formik'


import { COLORS } from '../../../constants/constants'
import { relevantCourtEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 230,
  margin: '0',
  borderColor: COLORS.lightGray,
  boxSizing: 'border-box',
  textOverflow: 'ellipsis'
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = { 
  width: 280,
  overflowY: 'hidden',
  textOverflow: 'ellipsis'
}

export const RelevantCourtSelector = ({infractionPath, ...props}) => {
  const [relevantCourtField, , relevantCourtHelpers] = useField(`${infractionPath}.relevantCourt`);
  const relevantCourtSelectorRef = useRef()
  const relevantCourtFieldList = Object.values(relevantCourtEnum)

  return (
    <SelectorWrapper ref={relevantCourtSelectorRef}>
      <Form.ControlLabel htmlFor="relevantCourtField">Tribunal compétent </Form.ControlLabel>
      <SelectPicker
        style={DEFAULT_SELECT_PICKER_STYLE}
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        searchable={false}
        container={()=>relevantCourtSelectorRef.current}
        value={relevantCourtField.value}
        onChange={relevantCourtHelpers.setValue}
        data={relevantCourtFieldList}
        labelKey={'libelle'}
        valueKey={'code'}
        {...props} />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  width: 280px;
  height: 58px;
  .rs-picker-menu {
    position: relative;
    margin-top: -50px;
  }
`