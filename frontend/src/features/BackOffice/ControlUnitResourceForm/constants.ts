import { number, object, string } from 'yup'

import type { ControlUnitResourceFormValues } from './types'

export const CONTROL_UNIT_RESOURCE_FORM_SCHEMA = object({
  controlUnitId: number().required('L’unité de contrôle est obligatoire.'),
  name: string().required('Le nom est obligatoire.'),
  portId: number().required('Le port est obligatoire.'),
  type: string().required('Le type est obligatoire.')
})

export const INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES: ControlUnitResourceFormValues = {
  controlUnitId: undefined,
  name: undefined,
  note: undefined,
  photo: undefined,
  portId: undefined,
  type: undefined
}
