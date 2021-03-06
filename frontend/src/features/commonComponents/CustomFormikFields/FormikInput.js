import React from 'react'
import {  useField } from 'formik';
import { Input } from 'rsuite'


export const FormikInput = ({ name, ...props }) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;
  

  return (
    <Input value={value} onChange={setValue} {...props} />
  );
}

