import { object, string } from 'yup'

import type { ControlUnitContactFormValues } from './types'

export const CONTROL_UNIT_CONTACT_FORM_SCHEMA = object().shape(
  {
    email: string().when('phone', {
      is: phone => !phone,
      then: shema => shema.required('Veuillez entrer un téléphone ou un email.')
    }),
    name: string().required('Veuillez choisir un nom.'),
    phone: string().when('email', {
      is: email => !email,
      then: shema => shema.required('Veuillez entrer un téléphone ou un email.')
    })
  },
  [['email', 'phone']]
)

export const INITIAL_CONTROL_UNIT_CONTACT_FORM_VALUES: ControlUnitContactFormValues = {
  controlUnitId: undefined,
  email: undefined,
  name: undefined,
  phone: undefined
}
