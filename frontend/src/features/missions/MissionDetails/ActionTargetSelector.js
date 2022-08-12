import React, { useRef } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import { useField } from 'formik'


import { actionTargetTypeEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 145,
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = { 
  width: 145,
}

export const ActionTargetSelector = ({currentActionIndex, ...props}) => {
  const [actionTargetField, , actionTargetHelpers] = useField(`envActions.${currentActionIndex}.actionTargetType`);
  const actionTargetSelectorRef = useRef()
  const actionTargetFieldList = Object.values(actionTargetTypeEnum)

  return (
    <SelectorWrapper ref={actionTargetSelectorRef}>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTargetType`}>
        Type de cible
      </Form.ControlLabel>
      <SelectPicker
        className='ghost'
        size='sm'
        cleanable={false}
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