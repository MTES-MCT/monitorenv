import { number, object, string } from 'yup'

import type { ControlUnitContactFormValues } from './types'

export const CONTROL_UNIT_CONTACT_FORM_SCHEMA = object({
  controlUnitId: number().required('L’unité de contrôle est obligatoire.'),
  name: string().required('Le nom est obligatoire.')
})

export const INITIAL_CONTROL_UNIT_CONTACT_FORM_VALUES: ControlUnitContactFormValues = {
  controlUnitId: undefined,
  email: undefined,
  name: undefined,
  note: undefined,
  phone: undefined
}
