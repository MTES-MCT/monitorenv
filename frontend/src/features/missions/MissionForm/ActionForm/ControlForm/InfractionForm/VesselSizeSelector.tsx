/* eslint-disable react/jsx-props-no-spreading */
import { type MutableRefObject, useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { vesselSizeEnum } from '../../../../../../domain/entities/missions'

export function VesselSizeSelector({ onChange, value, ...props }) {
  const vesselSizeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vesselSizeFieldList = Object.values(vesselSizeEnum)

  return (
    <SelectorWrapper ref={vesselSizeSelectorRef}>
      <Form.ControlLabel htmlFor="vesselSizeField">Taille du navire</Form.ControlLabel>
      <SelectPicker
        block
        cleanable={false}
        container={() => vesselSizeSelectorRef.current}
        data={vesselSizeFieldList}
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
