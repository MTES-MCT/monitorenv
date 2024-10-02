import { Item } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitContactList/Item'
import { sortControlUnitContactsByQualifiedName } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitContactList/utils'
import { type ControlUnit } from '@mtes-mct/monitor-ui'

import { StyledTextarea } from './style'

export function ContactDetails({
  contacts,
  termsNote
}: {
  contacts: ControlUnit.ControlUnitContactData[]
  termsNote: string | undefined
}) {
  const sortedControlUnitContacts = sortControlUnitContactsByQualifiedName(contacts)

  return (
    <>
      <StyledTextarea label="Modalités de contact avec l’unité" name="termsNote" readOnly value={termsNote} />

      {sortedControlUnitContacts.map(contact => (
        <Item key={contact.id} controlUnitContact={contact} />
      ))}
    </>
  )
}
