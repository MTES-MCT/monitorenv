import { object, string } from 'yup'

import type { ControlUnitAdministrationFormValues } from './types'

export const CONTROL_UNIT_ADMINISTRATION_FORM_SCHEMA = object({
  name: string().required('Le nom est obligatoire.')
})

export const INITIAL_CONTROL_UNIT_ADMINISTRATION_FORM_VALUES: ControlUnitAdministrationFormValues = {
  controlUnitIds: [],
  name: undefined
}
