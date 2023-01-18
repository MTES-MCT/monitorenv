/* eslint-disable react/jsx-props-no-spreading */
import { Form } from 'rsuite'
import styled from 'styled-components'

import { actionTargetTypeEnum } from '../../../../../domain/entities/missions'
import { SelectPickerWhite } from '../../../../../uiMonitor/CustomRsuite/SelectPicker'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 145
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = {
  width: 145
}

export function ActionTargetSelector({ currentActionIndex, onChange, value, ...props }) {
  const actionTargetFieldList = Object.values(actionTargetTypeEnum)

  return (
    <SelectorWrapper>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.actionTargetType`}>Type de cible</Form.ControlLabel>
      <SelectPickerWhite
        cleanable={false}
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
`
