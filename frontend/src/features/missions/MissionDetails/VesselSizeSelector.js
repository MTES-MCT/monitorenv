import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Form, SelectPicker } from 'rsuite'
import { useFormikContext, useField } from 'formik'

import { vehicleTypeEnum, vesselSizeEnum } from '../../../domain/entities/missions'

export const VesselSizeSelector = ({infractionPath, currentActionIndex, ...props}) => {
  const { values: { envActions } } = useFormikContext();
  const [vesselSizeField, , vesselSizeHelpers] = useField(`${infractionPath}.vesselSize`);
  const vesselSizeSelectorRef = useRef()
  const vesselSizeFieldList = Object.values(vesselSizeEnum)
  const vehicleType = envActions[currentActionIndex]?.vehicleType

  useEffect(()=> {
    if ((vehicleType !== vehicleTypeEnum.VESSEL.code)
      && (vesselSizeField.value !== '')) {
        vesselSizeHelpers.setValue('')
    }
    if ((vehicleType === vehicleTypeEnum.VESSEL.code)
      && (vesselSizeField.value === '')) {
        vesselSizeHelpers.setValue(vesselSizeEnum.FROM_12_TO_24m.code)
    }
  }, [currentActionIndex, vehicleType, vesselSizeHelpers, vesselSizeField.value])

  return (
    <SelectorWrapper ref={vesselSizeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselSizeField">Taille du navire</Form.ControlLabel>
      <SelectPicker
        size='sm'
        block
        cleanable={false}
        disabled={vehicleType !== vehicleTypeEnum.VESSEL.code}
        searchable={false}
        container={()=>vesselSizeSelectorRef.current}
        value={vesselSizeField.value}
        onChange={vesselSizeHelpers.setValue}
        data={vesselSizeFieldList}
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