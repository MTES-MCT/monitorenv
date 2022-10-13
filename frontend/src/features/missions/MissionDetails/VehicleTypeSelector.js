import { useFormikContext, useField } from 'formik'
import React, { useEffect, useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { actionTargetTypeEnum, vehicleTypeEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 150
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = {
  width: 150
}

export function VehicleTypeSelector({ currentActionIndex, ...props }) {
  const {
    setFieldValue,
    values: { envActions }
  } = useFormikContext()
  const [vehicleTypeField, , { setValue }] = useField(`envActions.${currentActionIndex}.vehicleType`)
  const vehicleTypeSelectorRef = useRef()
  const vehicleTypeFieldList = Object.values(vehicleTypeEnum)
  const targetType = envActions[currentActionIndex]?.actionTargetType

  useEffect(() => {
    if (targetType !== actionTargetTypeEnum.VEHICLE.code && vehicleTypeField.value !== '') {
      setFieldValue(`envActions.${currentActionIndex}.vehicleType`, '')
    }
    if (targetType === actionTargetTypeEnum.VEHICLE.code && vehicleTypeField.value === '') {
      setFieldValue(`envActions.${currentActionIndex}.vehicleType`, vehicleTypeEnum.VESSEL.code)
    }
  }, [currentActionIndex, targetType, setFieldValue, vehicleTypeField.value])

  return (
    <SelectorWrapper ref={vehicleTypeSelectorRef}>
      <Form.ControlLabel htmlFor={`envActions.${currentActionIndex}.vehicleType`}>Type de véhicule</Form.ControlLabel>
      <SelectPicker
        className="ghost"
        cleanable={false}
        container={() => vehicleTypeSelectorRef.current}
        data={vehicleTypeFieldList}
        disabled={targetType !== actionTargetTypeEnum.VEHICLE.code}
        labelKey="libelle"
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        onChange={setValue}
        searchable={false}
        size="sm"
        style={DEFAULT_SELECT_PICKER_STYLE}
        value={vehicleTypeField.value}
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
