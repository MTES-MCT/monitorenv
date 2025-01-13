import { FieldArray } from 'formik'

import { MultipleThemeElement } from './MultipleThemeElement'

export function SurveillanceThemes({ envActionIndex, themesYear }) {
  return (
    <FieldArray
      name={`envActions[${envActionIndex}].controlPlans`}
      render={({ form, push, remove }) => (
        <MultipleThemeElement
          envActionIndex={envActionIndex}
          form={form}
          push={push}
          remove={remove}
          themesYear={themesYear}
        />
      )}
      validateOnChange={false}
    />
  )
}
