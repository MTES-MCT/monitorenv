import { MutableRefObject, useRef } from 'react'
import { TagPicker } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'

export function FilterTagPicker({ onChange, value, ...props }) {
  const filterWrapperRef = useRef() as MutableRefObject<HTMLDivElement>
  const { placeholder, style, ...rest } = props
  const selectedItems = value?.length

  return (
    <FilterWrapper style={style}>
      <InputContent>
        {placeholder}
        {selectedItems > 0 && <strong> ({selectedItems})</strong>}
      </InputContent>
      <StyledTagPicker
        {...rest}
        $selectedItems={selectedItems}
        cleanable={false}
        container={() => filterWrapperRef.current}
        onChange={onChange}
        placeholder=" "
        value={value}
      />
      <MenuWrapper ref={filterWrapperRef} />
    </FilterWrapper>
  )
}

const StyledTagPicker = styled(TagPicker)`
  background-color: transparent;
  margin-bottom: ${props => (props.$selectedItems > 0 ? '36px' : '0')};
  width: 100%;
  min-height: 36px;
  border: 0;
  .rs-picker-toggle.rs-btn.rs-btn-default {
    padding-top: 5px;
    padding-bottom: 5px;
    height: 30px;
  }
  input.rs-picker-toggle-textbox.rs-picker-toggle-read-only {
    border: 1px solid ${COLORS.lightGray} !important;
    background: transparent;
    opacity: 1;
  }
  svg.rs-picker-toggle-caret.rs-icon {
    top: 5px !important;
  }
  .rs-picker-toggle {
    background-color: transparent !important;
  }
  .rs-tag {
    background-color: ${COLORS.blueYonder};
    color: ${COLORS.white};
  }
  .rs-picker-tag-wrapper {
    display: ${props => (props.$selectedItems > 0 ? 'block' : 'none')};
    top: 36px;
    width: 100%;
  }
  .placement-bottom-start.rs-picker-picker-check-menu.rs-picker-menu {
    background-color: red !important;
  }
`
const MenuWrapper = styled.div`
  .rs-picker-menu {
    position: absolute;
    top: 32px !important;
  }
`
const FilterWrapper = styled.div`
  position: relative;
  min-width: 100px;
`

const InputContent = styled.div`
  position: absolute;
  top: 4px;
  font-size: 13px;
  margin-left: 10px;
`
