import { FieldArray } from 'formik'

import { MultipleThemeElement } from './MultipleThemeElement'

export function SurveillanceThemes({ currentActionIndex }) {
  return (
    <FieldArray
      name={`envActions.${currentActionIndex}.themes`}
      render={({ form, push, remove }) => (
        <MultipleThemeElement currentActionIndex={currentActionIndex} form={form} push={push} remove={remove} />
      )}
    />
  )
}
