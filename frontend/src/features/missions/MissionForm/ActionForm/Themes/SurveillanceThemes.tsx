import { FieldArray } from 'formik'

import { MultipleThemeElement } from './MultipleThemeElement'

export function SurveillanceThemes({ envActionIndex }) {
  return (
    <FieldArray
      name={`envActions.${envActionIndex}.themes`}
      render={({ form, push, remove }) => (
        <MultipleThemeElement envActionIndex={envActionIndex} form={form} push={push} remove={remove} />
      )}
      validateOnChange={false}
    />
  )
}
