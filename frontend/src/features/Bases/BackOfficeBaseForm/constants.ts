import { number, object, string } from 'yup'

import type { BaseFormValues } from './types'

export const BASE_FORM_SCHEMA = object({
  latitude: number().required('La latitude est obligatoire.'),
  longitude: number().required('La longitude est obligatoire.'),
  name: string().trim().min(1).required('Le nom est obligatoire.')
})

export const INITIAL_BASE_FORM_VALUES: BaseFormValues = {
  latitude: undefined,
  longitude: undefined,
  name: undefined
}
