import { Accent, Button, FormikTextInput, FormikTextarea, useKey } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import styled from 'styled-components'

import { INITIAL_CONTROL_UNIT_CONTACT_FORM_VALUES } from './constants'

import type { ControlUnitContactFormValues } from './types'

export type FormProps = {
  initialValues: ControlUnitContactFormValues | undefined
  onCancel: () => void
  onSubmit: (controlUnitContactFormValues: ControlUnitContactFormValues) => void
}
export function Form({ initialValues = INITIAL_CONTROL_UNIT_CONTACT_FORM_VALUES, onCancel, onSubmit }: FormProps) {
  const key = useKey([initialValues])

  return (
    <Formik key={key} initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <p>Ajouter un contact</p>

          <FormikTextInput isLight label="Nom du contact" name="name" />
          <FormikTextInput isLight label="Numéro de téléphone" name="phone" />
          <FormikTextInput isLight label="Adresse mail" name="email" />
          <FormikTextarea isLight label="Note" name="note" />

          <div>
            <Button type="submit">Enregistrer</Button>
            <Button accent={Accent.SECONDARY} onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </StyledForm>
      )}
    </Formik>
  )
}

const StyledForm = styled.form`
  background-color: ${p => p.theme.color.gainsboro};
  margin-top: 16px;
  padding: 16px;

  > div:not(:first-child) {
    margin-top: 16px;
  }
  > div:last-child {
    > .Element-Button:not(:first-child) {
      margin-left: 8px;
    }
  }
`
