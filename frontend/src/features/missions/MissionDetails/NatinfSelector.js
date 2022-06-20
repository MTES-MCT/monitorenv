import React, { useRef } from 'react'
import styled from 'styled-components';
import { Form, TagPicker } from 'rsuite';
import {  useField } from 'formik';

import { useGetInfractionsQuery } from '../../../api/infractionsAPI'

export const NatinfSelector = ({ infractionPath, ...props }) => {
  const [natinfField, , natinfHelpers] = useField(`${infractionPath}.natinf`);
  
  const selectorRef = useRef()
  const { data, isError, isLoading } = useGetInfractionsQuery()

  if (isError) {
    return ('Erreur')
  }
  if (isLoading) {
    return ('Chargement')
  }
  return (
    <SelectorWrapper ref={selectorRef}>
        <Form.ControlLabel htmlFor="natinf">Natinf : </Form.ControlLabel>
        <TagPicker
          virtualized
          block
          container={()=>selectorRef.current}
          value={natinfField.value}
          onChange={natinfHelpers.setValue}
          data={data}
          labelKey={'natinf_code'}
          valueKey={'natinf_code'}
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
