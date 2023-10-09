import { object, string } from 'yup'

import type { ControlUnitResourceFormValues } from './types'

export const CONTROL_UNIT_RESOURCE_FORM_SCHEMA = object().shape({
  baseId: string().required('Veuillez choisir une base.'),
  name: string().required('Veuillez entrer un nom.'),
  type: string().required('Veuillez choisir un type.')
})

export const INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES: ControlUnitResourceFormValues = {
  baseId: undefined,
  controlUnitId: undefined,
  name: undefined,
  note: undefined,
  photo: undefined,
  type: undefined
}
