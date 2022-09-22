import { useField } from 'formik'
import React, { useRef } from 'react'
import { Form, SelectPicker } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { relevantCourtEnum } from '../../../domain/entities/missions'

const DEFAULT_SELECT_PICKER_STYLE = {
  borderColor: COLORS.lightGray,
  boxSizing: 'border-box',
  margin: '0',
  textOverflow: 'ellipsis',
  width: 230
}

const DEFAULT_SELECT_PICKER_MENU_STYLE = {
  overflowY: 'hidden',
  textOverflow: 'ellipsis',
  width: 280
}

export function RelevantCourtSelector({ infractionPath, ...props }) {
  const [relevantCourtField, , relevantCourtHelpers] = useField(`${infractionPath}.relevantCourt`)
  const relevantCourtSelectorRef = useRef()
  const relevantCourtFieldList = Object.values(relevantCourtEnum)

  return (
    <SelectorWrapper ref={relevantCourtSelectorRef}>
      <Form.ControlLabel htmlFor="relevantCourtField">Tribunal compétent </Form.ControlLabel>
      <SelectPicker
        container={() => relevantCourtSelectorRef.current}
        data={relevantCourtFieldList}
        labelKey="libelle"
        menuStyle={DEFAULT_SELECT_PICKER_MENU_STYLE}
        onChange={relevantCourtHelpers.setValue}
        searchable={false}
        style={DEFAULT_SELECT_PICKER_STYLE}
        value={relevantCourtField.value}
        valueKey="code"
        {...props}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  width: 280px;
  height: 58px;
  .rs-picker-menu {
    position: relative;
    margin-top: -50px;
  }
`
