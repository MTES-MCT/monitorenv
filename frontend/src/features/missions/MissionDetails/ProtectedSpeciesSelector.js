import React, { useRef } from 'react'
import styled from 'styled-components';
import { Form, TagPicker } from 'rsuite';
import {  useField } from 'formik';
import { protectedSpeciesEnum } from '../../../domain/entities/missions';


export const ProtectedSpeciesSelector = ({ name, ...props }) => {
  const [natinfField, , natinfHelpers] = useField(name);
  
  const selectorRef = useRef()
  const data = Object.values(protectedSpeciesEnum)

  return (
    <SelectorWrapper ref={selectorRef}>
        <Form.ControlLabel htmlFor="natinf">Espèces protégées : </Form.ControlLabel>
        <TagPicker
          virtualized
          block
          container={()=>selectorRef.current}
          value={natinfField.value}
          onChange={natinfHelpers.setValue}
          data={data}
          labelKey={'libelle'}
          valueKey={'code'}
          {...props} />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  padding-right: 62px;
  .rs-picker-menu {
    position: relative;
    margin-top: -62px;
  }
`
