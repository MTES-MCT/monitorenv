import React, { useRef } from 'react'
import styled from 'styled-components';
import { Form, TagPicker } from 'rsuite';
import {  useField } from 'formik';

import { protectedSpeciesEnum } from '../../../domain/entities/missions';


export const ProtectedSpeciesSelector = ({ name, ...props }) => {
  const [protectedSpeciesField, , protectedSpeciesHelpers] = useField(name);
  
  const selectorRef = useRef()
  const data = Object.values(protectedSpeciesEnum)
  return (
    <SelectorWrapper ref={selectorRef}>
        <Form.ControlLabel htmlFor={name}>Espèces protégées </Form.ControlLabel>
        <TagPickerWhite
          virtualized
          block
          container={()=>selectorRef.current}
          value={protectedSpeciesField.value}
          onChange={protectedSpeciesHelpers.setValue}
          data={data}
          labelKey={'libelle'}
          valueKey={'code'}
          {...props} />
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