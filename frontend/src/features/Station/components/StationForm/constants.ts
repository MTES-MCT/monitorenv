import { array, number, object, string } from 'yup'

import type { StationFormValues } from './types'

export const STATION_FORM_SCHEMA = object({
  coordinates: array()
    .of(number())
    .min(2, 'Les coordonnées sont obligatoires.')
    .max(2, 'Les coordonnées sont obligatoires.')
    .required('Les coordonnées sont obligatoires.'),
  name: string().trim().min(1).required('Le nom est obligatoire.')
})

export const INITIAL_STATION_FORM_VALUES: StationFormValues = {
  coordinates: undefined,
  name: undefined
}
