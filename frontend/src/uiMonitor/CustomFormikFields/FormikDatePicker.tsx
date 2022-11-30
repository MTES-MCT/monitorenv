/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import { MutableRefObject, useRef, useState, useCallback } from 'react'
import { DatePicker } from 'rsuite'
import { parseISO } from 'rsuite/esm/utils/dateUtils'
import styled from 'styled-components'

export const placeholderDateTimePicker =
  '\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0:\xa0\xa0\xa0\xa0\xa0\xa0'

type FormikDatePickerProps = {
  [x: string]: any
  cleanable?: boolean
  ghost?: boolean
  name: string
  oneTap?: boolean
}
export function FormikDatePicker({ cleanable, ghost, name, oneTap, ...props }: FormikDatePickerProps) {
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
  const valueAsDate = parsedValue.toString() === 'Invalid Date' ? null : parsedValue
  const datepickerRef = useRef() as MutableRefObject<HTMLDivElement>

  const [val, setVal] = useState(undefined)

  const onSelect = useCallback(
    _value => {
      if (oneTap) {
        setValueAsString(_value)
      } else {
        setVal(_value)
      }
    },
    [setVal, setValueAsString, oneTap]
  )

  const onOk = useCallback(_value => !oneTap && setValueAsString(_value), [oneTap, setValueAsString])
  const onExit = useCallback(() => val && setValueAsString(val), [val, setValueAsString])
  const onClean = useCallback(() => setValueAsString(null), [setValueAsString])

  return (
    <DatePickerWrapper ref={datepickerRef} data-cy="datepicker">
      <DatePicker
        className={`${ghost && 'ghost'}`}
        cleanable={cleanable}
        container={() => datepickerRef.current}
        {...props}
        onClean={onClean}
        oneTap={oneTap}
        onExit={onExit}
        onOk={onOk}
        onSelect={onSelect}
        value={valueAsDate}
      />
    </DatePickerWrapper>
  )
}

const DatePickerWrapper = styled.div`
  width: 250px;
  height: 30px;
  .rs-picker-date-menu {
    position: relative;
    margin-top: -32px;
  }
`
