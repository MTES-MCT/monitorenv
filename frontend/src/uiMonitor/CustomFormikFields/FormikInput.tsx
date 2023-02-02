/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import { Input } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'

export function FormikInput({ name, ...props }) {
  const [field, meta, helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers

  const handleOnChange = v => {
    setValue(v)
  }

  return (
    <ErrorWrapper error={!!meta.error}>
      <Input onChange={handleOnChange} value={value || ''} {...props} />
      {meta.error && meta.touched && <div>{meta.error}</div>}
    </ErrorWrapper>
  )
}

const ErrorWrapper = styled.div<{ error: boolean }>`
  .rs-input,
  .rs-input:hover {
    ${p => (p.error ? 'border: 1px solid red;' : '')}
  }
`

export const FormikInputGhost = styled(FormikInput)`
  background-color: ${COLORS.white};
`
