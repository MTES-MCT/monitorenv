import { type ControlUnit } from '@mtes-mct/monitor-ui'
import { sortBy } from 'lodash-es'

import { CONTROL_UNIT_CONTACT_PREDEFINED_NAMES } from './constants'

/**
 * Sort control unit contacts by qualified name.
 *
 * @description
 * Predefined names comes first, then custom names, both in alphabetical order.
 */
export function sortControlUnitContactsByQualifiedName(
  controlUnitContacts: ControlUnit.ControlUnitContactData[]
): ControlUnit.ControlUnitContactData[] {
  const predefinedNamedContacts = controlUnitContacts.filter(({ name }) =>
    CONTROL_UNIT_CONTACT_PREDEFINED_NAMES.includes(name)
  )
  const customNamedContacts = controlUnitContacts.filter(
    ({ name }) => !CONTROL_UNIT_CONTACT_PREDEFINED_NAMES.includes(name)
  )
  const sortedPredefinedNamedContacts = sortBy(predefinedNamedContacts, ['name'])
  const sortedCustomNamedContacts = sortBy(customNamedContacts, ['name'])

  return [...sortedPredefinedNamedContacts, ...sortedCustomNamedContacts]
}
