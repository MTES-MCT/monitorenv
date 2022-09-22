import { useField } from 'formik'
import React, { useRef } from 'react'
import { SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'

export function ControlThemeSelector({ name, themes, valueKey, ...props }) {
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers
  const wrapperRef = useRef()

  return (
    <Wrapper ref={wrapperRef}>
      <SelectPicker
        block
        container={() => wrapperRef.current}
        data={themes}
        labelKey={valueKey}
        onChange={setValue}
        searchable={false}
        value={value}
        valueKey={valueKey}
        {...props}
      />
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
