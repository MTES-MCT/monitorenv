/* eslint-disable react/jsx-props-no-spreading */
import { DatePicker } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import _ from 'lodash'
import { MutableRefObject, useEffect, useReducer, useRef } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'

export const placeholderDateTimePicker =
  '\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0:\xa0\xa0\xa0\xa0\xa0\xa0'

type FormikDatePickerProps = {
  isCompact?: boolean
  isLight?: boolean
  label: string
  name: string
  withTime?: boolean
}
export function FormikDatePicker({ isCompact, isLight, label, name, withTime }: FormikDatePickerProps) {
  const [field, meta, helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers
  const datepickerRef = useRef() as MutableRefObject<HTMLDivElement>

  const [keyForceUpdate, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    forceUpdate()
  }, [name, forceUpdate])

  return (
    <DatePickerWrapper ref={datepickerRef} data-cy="datepicker" hasError={!_.isEmpty(meta.error)}>
      <DatePicker
        key={keyForceUpdate}
        defaultValue={value}
        isCompact={isCompact}
        isLight={isLight}
        isStringDate
        label={label}
        onChange={setValue}
        withTime={withTime}
      />
    </DatePickerWrapper>
  )
}

const DatePickerWrapper = styled.div<{ hasError: boolean }>`
  legend {
    ${p => (p.hasError ? `color:  ${COLORS.maximumRed};` : '')}
  }
  > fieldset > div > div {
    ${p => (p.hasError ? `border: 1px solid ${COLORS.maximumRed};` : '')}
  }
  input {
    width: 1.2rem;
  }
  div > span:first-child {
    input:last-child {
      width: 2.5rem;
    }
  }
`
