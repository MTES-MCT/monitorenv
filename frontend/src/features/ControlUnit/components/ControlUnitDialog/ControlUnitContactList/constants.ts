import { ControlUnit, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { object, string } from 'yup'

import { sortCollectionByLocalizedProps } from '../../../../../utils/sortCollectionByLocalizedProps'

import type { ControlUnitContactFormValues } from './types'

const frenchPhoneRegex = /^0[1-9]\d{8}$/
const internationalPhoneRegex = /^00\d{6,15}$/

export const CONTROL_UNIT_CONTACT_FORM_SCHEMA = object().shape(
  {
    email: string().when('phone', {
      is: phone => !phone,
      then: schema => schema.required('Veuillez entrer un téléphone ou un email.')
    }),
    name: string().required('Veuillez choisir un nom.'),
    phone: string()
      .when('email', {
        is: email => !email,
        then: schema => schema.required('Veuillez entrer un téléphone ou un email.')
      })
      .test(
        'is-valid-phone-number',
        "Le numéro saisi n'est pas valide. Si c'est un numéro satellitaire ou d'outre-mer, ajouter 00 avant les premiers chiffres.",
        value =>
          string().matches(frenchPhoneRegex).isValidSync(value) ||
          string().matches(internationalPhoneRegex).isValidSync(value)
      )
  },
  [['email', 'phone']]
)

export const INITIAL_CONTROL_UNIT_CONTACT_FORM_VALUES: ControlUnitContactFormValues = {
  controlUnitId: undefined,
  email: undefined,
  isEmailSubscriptionContact: false,
  isSmsSubscriptionContact: false,
  name: undefined,
  phone: undefined
}

export const CONTROL_UNIT_CONTACT_PREDEFINED_NAMES: string[] = Object.values(
  ControlUnit.ControlUnitContactPredefinedName
).sort()
export const SORTED_CONTROL_UNIT_CONTACT_PREDEFINED_NAMES_AS_OPTIONS = [
  ...sortCollectionByLocalizedProps(
    ['label'],
    getOptionsFromLabelledEnum(ControlUnit.ControlUnitContactPredefinedName)
  ),
  {
    label: 'Créer un nom personnalisé',
    value: 'SWITCH_TO_CUSTOM_NAME'
  }
]
