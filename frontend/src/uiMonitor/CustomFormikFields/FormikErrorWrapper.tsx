/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import styled from 'styled-components'

type FormikErrorWrapperProps = {
  children: React.ReactNode
  name: string
  noMessage?: boolean
}
export function FormikErrorWrapper({ children, name, noMessage }: FormikErrorWrapperProps) {
  const [, meta] = useField(name)

  return (
    <ErrorWrapper error={!!meta.error}>
      {children}
      {!noMessage && !!meta.error && <div>{JSON.stringify(meta.error)}</div>}
    </ErrorWrapper>
  )
}

const ErrorWrapper = styled.div<{ error: boolean }>`
  width: 100%;
  .rs-input,
  .rs-input:hover,
  .rs-picker-toggle {
    ${p => (p.error ? `border: 1px solid ${p.theme.color.maximumRed};` : '')}
  }
  label {
    ${p => (p.error ? `color: ${p.theme.color.maximumRed};` : '')}
  }
`
