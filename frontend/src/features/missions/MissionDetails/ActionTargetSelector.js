import { useField } from 'formik'
import React, { useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { actionTargetTypeEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 145
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = {
  width: 145
}

export function ActionTargetSelector({ currentActionIndex, ...props }) {
  const [actionTargetField, , actionTargetHelpers] = useField(`envActions.${currentActionIndex}.actionTargetType`)
  const actionTargetSelectorRef = useRef()
  const actionTargetFieldList = Object.values(actionTargetTypeEnum)

  return (
    <SelectorWrapper ref={actionTargetSelectorRef}>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTargetType`}>Type de cible</Form.ControlLabel>
      <SelectPicker
        className="ghost"
        cleanable={false}
        container={() => actionTargetSelectorRef.current}
        data={actionTargetFieldList}
        labelKey="libelle"
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        onChange={actionTargetHelpers.setValue}
        searchable={false}
        size="sm"
        style={DEFAULT_SELECT_PICKER_STYLE}
        value={actionTargetField.value}
        valueKey="code"
        {...props}
      />
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
