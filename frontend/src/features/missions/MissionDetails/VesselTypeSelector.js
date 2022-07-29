import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import { useFormikContext, useField } from 'formik'


import { COLORS } from '../../../constants/constants'
import { vesselTypeEnum, vehicleTypeEnum } from '../../../domain/entities/missions'

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

export const VesselTypeSelector = ({infractionPath, currentActionIndex, ...props}) => {
  const { values: { actions } } = useFormikContext();
  const [vesselTypeField, , vesselTypeHelpers] = useField(`${infractionPath}.vesselType`);
  const vesselTypeSelectorRef = useRef()
  const vesselTypeFieldList = Object.values(vesselTypeEnum)
  const vehicleType = actions[currentActionIndex]?.vehicleType

  useEffect(()=> {
    if ((vehicleType !== vehicleTypeEnum.VESSEL.code)
      && (vesselTypeField.value !== '')) {
        vesselTypeHelpers.setValue('')
    }
  }, [currentActionIndex, vehicleType, vesselTypeHelpers, vesselTypeField.value])

  return (
    <SelectorWrapper ref={vesselTypeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselTypeField">Type de navire : </Form.ControlLabel>
      <SelectPicker 
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