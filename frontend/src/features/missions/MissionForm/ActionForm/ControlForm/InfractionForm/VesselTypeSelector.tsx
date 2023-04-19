/* eslint-disable react/jsx-props-no-spreading */
import { MutableRefObject, useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { vesselTypeLabels } from '../../../../../../domain/entities/missions'

export function VesselTypeSelector({ onChange, value, ...props }) {
  const vesselTypeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vesselTypeFieldList = Object.values(vesselTypeLabels)

  return (
    <SelectorWrapper ref={vesselTypeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselTypeField">Type de navire</Form.ControlLabel>
      <SelectPicker
        block
        cleanable={false}
        container={() => vesselTypeSelectorRef.current}
        data={vesselTypeFieldList}
        labelKey="libelle"
        onChange={onChange}
        searchable={false}
        size="sm"
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
