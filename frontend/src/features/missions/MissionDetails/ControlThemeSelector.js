import React, { useRef } from 'react'
import styled from 'styled-components';
import { SelectPicker } from 'rsuite';
import {  useField } from 'formik';

import { COLORS } from '../../../constants/constants';

export const ControlThemeSelector = ({ name, themes,valueKey, ...props }) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;
  const wrapperRef = useRef()

  return (
    <Wrapper ref={wrapperRef}>
      <SelectPicker
        block
        searchable={false}
        container={()=>wrapperRef.current}
        value={value}
        onChange={setValue}
        data={themes}
        labelKey={valueKey}
        valueKey={valueKey}
        {...props} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .rs-picker-menu {
    position: relative;
    margin-top: -32px;
  }
  .rs-picker-toggle {
    background: ${COLORS.white} !important;
  }
`
