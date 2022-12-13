/* eslint-disable react/jsx-props-no-spreading */
import { DatePicker } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { MutableRefObject, useRef, useCallback } from 'react'
import { parseISO } from 'rsuite/esm/utils/dateUtils'
import styled from 'styled-components'

export const placeholderDateTimePicker =
  '\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0:\xa0\xa0\xa0\xa0\xa0\xa0'

type FormikDatePickerProps = {
  ghost?: boolean
  label: string
  name: string
  withTime?: boolean
}
export function FormikDatePicker({ ghost, label, name, withTime }: FormikDatePickerProps) {
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers

  const setValueAsString = useCallback(
    date => {
      const dateAsString = date ? date.toISOString() : null
      setValue(dateAsString)
    },
    [setValue]
  )
  // parseISO cannot parse undefined. Returns 'Invalid Date' if it cannot parse value.
  const parsedValue = parseISO(value || null)
  const valueAsDate = parsedValue.toString() === 'Invalid Date' ? undefined : parsedValue
  const datepickerRef = useRef() as MutableRefObject<HTMLDivElement>

  return (
    <DatePickerWrapper ref={datepickerRef} data-cy="datepicker" ghost={ghost}>
      <DatePicker defaultValue={valueAsDate} label={label} onChange={setValueAsString} withTime={withTime} />
    </DatePickerWrapper>
  )
}

const DatePickerWrapper = styled.div<{ ghost?: boolean }>`
  input {
    width: 1.2rem;
  }
  div > span:first-child {
    input:last-child {
      width: 2.5rem;
    }
  }
  div > span > span,
  .js-ranged-time-picker-option {
    ${p => (p.ghost ? 'background: white' : '')}
  }
`
