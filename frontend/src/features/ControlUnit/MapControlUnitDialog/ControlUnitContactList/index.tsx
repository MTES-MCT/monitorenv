// import styled from 'styled-components'

import { Accent, Button, FormikTextarea } from '@mtes-mct/monitor-ui'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Form } from './Form'
import { Item } from './Item'
import { Section } from '../shared/Section'

import type { ControlUnitContactFormValues } from './types'
import type { ControlUnit } from '../../../../domain/entities/ControlUnit/types'

export type ControlUnitContactListProps = {
  controlUnitContacts: ControlUnit.ControlUnitContactData[]
}
export function ControlUnitContactList({ controlUnitContacts }: ControlUnitContactListProps) {
  const [editedControlUnitContactId, setEditedControlUnitContactId] = useState<number | undefined>(undefined)
  const [isNewControlUnitContactFormOpen, setIsNewControlUnitContactFormOpen] = useState(false)

  const editedControlUnitContact = controlUnitContacts.find(({ id }) => id === editedControlUnitContactId)
  const isFormOpen = !!editedControlUnitContact || isNewControlUnitContactFormOpen

  const closeForm = useCallback(() => {
    setEditedControlUnitContactId(undefined)
    setIsNewControlUnitContactFormOpen(false)
  }, [])

  const createOrUpdateControlUnitContact = useCallback((controlUnitContactFormValues: ControlUnitContactFormValues) => {
    // eslint-disable-next-line no-console
    console.log(controlUnitContactFormValues)

    setEditedControlUnitContactId(undefined)
    setIsNewControlUnitContactFormOpen(false)
  }, [])

  const openForm = useCallback(() => {
    setIsNewControlUnitContactFormOpen(true)
  }, [])

  return (
    <Section>
      <Section.Title>Contacts</Section.Title>
      <StyledSectionBody>
        <FormikTextarea label="Modalités de contact avec l’unité" name="termsNote" />

        {controlUnitContacts.map(controlUnitContact => (
          <Item
            key={controlUnitContact.id}
            controlUnitContact={controlUnitContact}
            onEdit={setEditedControlUnitContactId}
          />
        ))}

        {isFormOpen ? (
          <Form
            initialValues={editedControlUnitContact}
            onCancel={closeForm}
            onSubmit={createOrUpdateControlUnitContact}
          />
        ) : (
          <div>
            <Button accent={Accent.SECONDARY} onClick={openForm}>
              Ajouter un contact
            </Button>
          </div>
        )}
      </StyledSectionBody>
    </Section>
  )
}

const StyledSectionBody = styled(Section.Body)`
  > .Field-Textarea {
    margin-bottom: 16px;
  }
  > div:last-child {
    margin-top: 16px;
  }
`
