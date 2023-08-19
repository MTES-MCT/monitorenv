import { object, string } from 'yup'

import type { PortFormValues } from './types'

export const PORT_FORM_SCHEMA = object({
  name: string().required('Le nom est obligatoire.')
})

export const INITIAL_PORT_FORM_VALUES: PortFormValues = {
  controlUnitResourceIds: [],
  name: undefined
}
