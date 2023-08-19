import { number, object, string } from 'yup'

import type { ControlUnitFormValues } from './types'

export const CONTROL_UNIT_FORM_SCHEMA = object({
  controlUnitAdministrationId: number().required('L’administration est obligatoire.'),
  name: string().required('Le nom est obligatoire.')
})

export const INITIAL_CONTROL_UNIT_FORM_VALUES: ControlUnitFormValues = {
  areaNote: undefined,
  controlUnitAdministrationId: undefined,
  controlUnitContactIds: [],
  controlUnitResourceIds: [],
  isArchived: false,
  name: undefined,
  termsNote: undefined
}
