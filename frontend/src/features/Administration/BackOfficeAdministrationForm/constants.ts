import { object, string } from 'yup'

import type { AdministrationFormValues } from './types'

export const ADMINISTRATION_FORM_SCHEMA = object({
  name: string().required('Le nom est obligatoire.')
})

export const INITIAL_ADMINISTRATION_FORM_VALUES: AdministrationFormValues = {
  controlUnitIds: [],
  name: undefined
}
