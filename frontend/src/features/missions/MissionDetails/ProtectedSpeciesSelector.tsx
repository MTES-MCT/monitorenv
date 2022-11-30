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
  const handleOnChange = v => {
    protectedSpeciesHelpers.setValue(v)
  }

  return (
    <SelectorWrapper ref={selectorRef}>
      <Form.ControlLabel htmlFor={name}>Espèces protégées </Form.ControlLabel>
      <TagPickerWhite
        block
        container={() => selectorRef.current}
        data={data.sort((a, b) => a.libelle.localeCompare(b.libelle))}
        labelKey="libelle"
        onChange={handleOnChange}
        size="sm"
        value={protectedSpeciesField.value}
        valueKey="code"
        {...props}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  .rs-picker-menu {
    position: relative;
    margin-top: -48px;
  }
`
const TagPickerWhite = styled(TagPicker)`
  .rs-picker-toggle {
    background: white !important;
  }
`
