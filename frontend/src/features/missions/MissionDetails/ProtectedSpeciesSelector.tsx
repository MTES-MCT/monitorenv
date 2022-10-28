/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import { MutableRefObject, useRef } from 'react'
import { Form, TagPicker } from 'rsuite'
import styled from 'styled-components'

import { protectedSpeciesEnum } from '../../../domain/entities/missions'

export function ProtectedSpeciesSelector({ name, ...props }) {
  const [protectedSpeciesField, , protectedSpeciesHelpers] = useField(name)

  const selectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const data = Object.values(protectedSpeciesEnum)

  return (
    <SelectorWrapper ref={selectorRef}>
      <Form.ControlLabel htmlFor={name}>Espèces protégées </Form.ControlLabel>
      <TagPickerWhite
        block
        container={() => selectorRef.current}
        data={data}
        labelKey="libelle"
        onChange={protectedSpeciesHelpers.setValue}
        value={protectedSpeciesField.value}
        valueKey="code"
        virtualized
        {...props}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  .rs-picker-menu {
    position: relative;
    margin-top: -58px;
  }
`
const TagPickerWhite = styled(TagPicker)`
  .rs-picker-toggle {
    background: white !important;
  }
`
