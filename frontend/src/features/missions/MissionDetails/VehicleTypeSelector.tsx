/* eslint-disable react/jsx-props-no-spreading */
import { MutableRefObject, useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { vehicleTypeEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 150
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = {
  width: 150
}

export function VehicleTypeSelector({ currentActionIndex, disabled, onChange, value, ...props }) {
  const vehicleTypeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vehicleTypeFieldList = Object.values(vehicleTypeEnum)

  return (
    <SelectorWrapper ref={vehicleTypeSelectorRef}>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.vehicleType`}>Type de véhicule</Form.ControlLabel>
      <SelectPicker
        className="ghost"
        cleanable={false}
        container={() => vehicleTypeSelectorRef.current}
        data={vehicleTypeFieldList}
        disabled={disabled}
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
