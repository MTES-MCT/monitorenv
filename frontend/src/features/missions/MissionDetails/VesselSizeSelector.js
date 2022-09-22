import { useFormikContext, useField } from 'formik'
import React, { useRef, useEffect } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { vehicleTypeEnum, vesselSizeEnum } from '../../../domain/entities/missions'

export function VesselSizeSelector({ currentActionIndex, infractionPath, ...props }) {
  const {
    values: { envActions }
  } = useFormikContext()
  const [vesselSizeField, , vesselSizeHelpers] = useField(`${infractionPath}.vesselSize`)
  const vesselSizeSelectorRef = useRef()
  const vesselSizeFieldList = Object.values(vesselSizeEnum)
  const vehicleType = envActions[currentActionIndex]?.vehicleType

  useEffect(() => {
    if (vehicleType !== vehicleTypeEnum.VESSEL.code && vesselSizeField.value !== '') {
      vesselSizeHelpers.setValue('')
    }
    if (vehicleType === vehicleTypeEnum.VESSEL.code && vesselSizeField.value === '') {
      vesselSizeHelpers.setValue(vesselSizeEnum.FROM_12_TO_24m.code)
    }
  }, [currentActionIndex, vehicleType, vesselSizeHelpers, vesselSizeField.value])

  return (
    <SelectorWrapper ref={vesselSizeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselSizeField">Taille du navire</Form.ControlLabel>
      <SelectPicker
        block
        cleanable={false}
        container={() => vesselSizeSelectorRef.current}
        data={vesselSizeFieldList}
        disabled={vehicleType !== vehicleTypeEnum.VESSEL.code}
        labelKey="libelle"
        onChange={vesselSizeHelpers.setValue}
        searchable={false}
        size="sm"
        value={vesselSizeField.value}
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
