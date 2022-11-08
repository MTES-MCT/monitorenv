/* eslint-disable react/jsx-props-no-spreading */
import { MutableRefObject, useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { actionTargetTypeEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 145
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = {
  width: 145
}

export function ActionTargetSelector({ currentActionIndex, onChange, value, ...props }) {
  const actionTargetSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
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
        onChange={onChange}
        searchable={false}
        size="sm"
        style={DEFAULT_SELECT_PICKER_STYLE}
        value={value}
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
