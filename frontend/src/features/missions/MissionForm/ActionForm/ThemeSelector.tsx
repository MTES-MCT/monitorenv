/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import { MutableRefObject, useRef } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { SelectPicker } from '../../../../uiMonitor/CustomRsuite/SelectPicker'

export function ThemeSelector({ name, themes, valueKey, ...props }) {
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>

  const handleOnChange = v => {
    setValue(v)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <SelectPicker
        block
        data={themes.sort((a, b) => a[valueKey].localeCompare(b[valueKey]))}
        labelKey={valueKey}
        onChange={handleOnChange}
        searchable={themes.length > 10}
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
