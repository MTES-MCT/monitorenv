import { useFormikContext, useField } from 'formik'
import React, { useEffect, useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { vesselTypeEnum, vehicleTypeEnum } from '../../../domain/entities/missions'

export function VesselTypeSelector({ currentActionIndex, infractionPath, ...props }) {
  const {
    values: { envActions }
  } = useFormikContext()
  const [vesselTypeField, , vesselTypeHelpers] = useField(`${infractionPath}.vesselType`)
  const vesselTypeSelectorRef = useRef()
  const vesselTypeFieldList = Object.values(vesselTypeEnum)
  const vehicleType = envActions[currentActionIndex]?.vehicleType

  useEffect(() => {
    if (vehicleType !== vehicleTypeEnum.VESSEL.code && vesselTypeField.value !== '') {
      vesselTypeHelpers.setValue('')
    }
    if (vehicleType === vehicleTypeEnum.VESSEL.code && vesselTypeField.value === '') {
      vesselTypeHelpers.setValue(vesselTypeEnum.FISHING.code)
    }
  }, [currentActionIndex, vehicleType, vesselTypeHelpers, vesselTypeField.value])

  return (
    <SelectorWrapper ref={vesselTypeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselTypeField">Type de navire</Form.ControlLabel>
      <SelectPicker
        block
        cleanable={false}
        container={() => vesselTypeSelectorRef.current}
        data={vesselTypeFieldList}
        disabled={vehicleType !== vehicleTypeEnum.VESSEL.code}
        labelKey="libelle"
        onChange={vesselTypeHelpers.setValue}
        searchable={false}
        size="sm"
        value={vesselTypeField.value}
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
