import { sortBy } from 'lodash/fp'

import { CONTROL_UNIT_CONTACT_NAMES } from './constants'

import type { ControlUnit } from '../../../../../domain/entities/controlUnit'

/**
 * Sort control unit contacts by qualified name.
 *
 * @description
 * Predefined names comes first, then custom names, both in alphabetical order.
 */
export function sortControlUnitContactsByQualifiedName(
  controlUnitContacts: ControlUnit.ControlUnitContactData[]
): ControlUnit.ControlUnitContactData[] {
  const predefinedNamedContacts = controlUnitContacts.filter(({ name }) => CONTROL_UNIT_CONTACT_NAMES.includes(name))
  const customNamedContacts = controlUnitContacts.filter(({ name }) => !CONTROL_UNIT_CONTACT_NAMES.includes(name))
  const sortedPredefinedNamedContacts = sortBy(['name'], predefinedNamedContacts)
  const sortedCustomNamedContacts = sortBy(['name'], customNamedContacts)

  return [...sortedPredefinedNamedContacts, ...sortedCustomNamedContacts]
}
