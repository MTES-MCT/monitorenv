import React, {useRef} from 'react'
import {  useField } from 'formik';
import { DatePicker } from 'rsuite'
import { parseISO } from 'rsuite/esm/utils/dateUtils';
import styled from 'styled-components';


export const FormikDatePicker = ({ name, ...props }) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;

  const setValueAsString = (date) => {
    const dateAsString = date ? date.toISOString() : null
    setValue(dateAsString)
  }
  // parseISO cannot parse undefined. Returns 'Invalid Date' if it cannot parse value.
  const parsedValue = parseISO(value || null) 
  const valueAsDate = parsedValue.toString() === 'Invalid Date' ? null : parsedValue
  const datepickerRef = useRef()
  return (
    <DatePickerWrapper ref={datepickerRef}>
      <DatePicker container={()=>datepickerRef.current} {...props} value={valueAsDate} onChange={setValueAsString} />
    </DatePickerWrapper>
  );
}

const DatePickerWrapper = styled.div`
  width: 250px
`