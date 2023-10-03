import { object, string } from 'yup'

import type { BaseFormValues } from './types'

export const BASE_FORM_SCHEMA = object({
  name: string().required('Le nom est obligatoire.')
})

export const INITIAL_BASE_FORM_VALUES: BaseFormValues = {
  name: undefined
}
