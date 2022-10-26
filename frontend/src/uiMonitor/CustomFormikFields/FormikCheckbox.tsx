/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik'
import { Checkbox } from 'rsuite'

export function FormikCheckbox({ defaultValue, label, name, ...props }) {
  const [field, , helpers] = useField(name)
  const { value } = field
  const { setValue } = helpers
  const handleSetValue = val => {
    setValue(val)
  }

  return (
    <Checkbox name={name} onChange={handleSetValue} value={value} {...props} defaultValue={defaultValue}>
      {label}
    </Checkbox>
  )
}
