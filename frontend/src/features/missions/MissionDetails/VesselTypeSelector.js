import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import { useFormikContext, useField } from 'formik'


import { vesselTypeEnum, vehicleTypeEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  width: 145,
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = { 
  width: 145,
}

export const VesselTypeSelector = ({infractionPath, currentActionIndex, ...props}) => {
  const { values: { envActions } } = useFormikContext();
  const [vesselTypeField, , vesselTypeHelpers] = useField(`${infractionPath}.vesselType`);
  const vesselTypeSelectorRef = useRef()
  const vesselTypeFieldList = Object.values(vesselTypeEnum)
  const vehicleType = envActions[currentActionIndex]?.vehicleType

  useEffect(()=> {
    if ((vehicleType !== vehicleTypeEnum.VESSEL.code)
      && (vesselTypeField.value !== '')) {
        vesselTypeHelpers.setValue('')
    }
    if ((vehicleType === vehicleTypeEnum.VESSEL.code)
      && (vesselTypeField.value === '')) {
        vesselTypeHelpers.setValue(vesselTypeEnum.FISHING.code)
    }
  }, [currentActionIndex, vehicleType, vesselTypeHelpers, vesselTypeField.value])

  return (
    <SelectorWrapper ref={vesselTypeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselTypeField">Type de navire</Form.ControlLabel>
      <SelectPicker
        size='sm'
        cleanable={false}
        disabled={vehicleType !== vehicleTypeEnum.VESSEL.code}
        style={DEFAULT_SELECT_PICKER_STYLE}
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        searchable={false}
        container={()=>vesselTypeSelectorRef.current}
        value={vesselTypeField.value}
        onChange={vesselTypeHelpers.setValue}
        data={vesselTypeFieldList}
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