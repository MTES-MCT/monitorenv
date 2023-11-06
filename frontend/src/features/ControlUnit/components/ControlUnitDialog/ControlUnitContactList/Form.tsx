import { Accent, Button, FormikTextInput, Icon, IconButton, THEME, useKey } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import styled from 'styled-components'

import { CONTROL_UNIT_CONTACT_FORM_SCHEMA } from './constants'
import { FormikNameSelect } from './FormikNameSelect'

import type { ControlUnitContactFormValues } from './types'
import type { Promisable } from 'type-fest'

export type FormProps = {
  initialValues: ControlUnitContactFormValues
  onCancel: () => Promisable<void>
  onDelete?: () => Promisable<void>
  onSubmit: (controlUnitContactFormValues: ControlUnitContactFormValues) => void
}
export function Form({ initialValues, onCancel, onDelete, onSubmit }: FormProps) {
  const key = useKey([initialValues])
  const isNew = !initialValues.id

  return (
    <Formik
      key={key}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={CONTROL_UNIT_CONTACT_FORM_SCHEMA}
    >
      {({ handleSubmit }) => (
        <>
          <Title>{isNew ? 'Ajouter un contact' : 'Éditer un contact'}</Title>
          <StyledForm onSubmit={handleSubmit}>
            <FormikNameSelect />
            <FormikTextInput isLight label="Numéro de téléphone" name="phone" type="tel" />
            <FormikTextInput isLight label="Adresse mail" name="email" type="email" />

            <ActionBar>
              <div>
                <Button type="submit">{isNew ? 'Ajouter' : 'Enregistrer les modifications'}</Button>
                <Button accent={Accent.SECONDARY} onClick={onCancel}>
                  Annuler
                </Button>
              </div>
              {onDelete && (
                <IconButton
                  accent={Accent.SECONDARY}
                  color={THEME.color.maximumRed}
                  Icon={Icon.Delete}
                  onClick={onDelete}
                  // TODO Add `borderColor` in Monitor UI.
                  style={{ borderColor: THEME.color.maximumRed }}
                  title="Supprimer ce contact"
                />
              )}
            </ActionBar>
          </StyledForm>
        </>
      )}
    </Formik>
  )
}

const Title = styled.p`
  background-color: ${p => p.theme.color.gainsboro};
  margin: 16px 0 2px;
  padding: 8px 16px;
  /* TODO This should be the default height everywhere to have a consistent and exact height of 18px. */
  /* Monitor UI provides that value: https://github.com/MTES-MCT/monitor-ui/blob/main/src/GlobalStyle.ts#L76. */
  line-height: 1.3846;
`

const StyledForm = styled.form`
  background-color: ${p => p.theme.color.gainsboro};
  padding: 16px;

  > div:not(:first-child) {
    margin-top: 16px;
  }
`

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;

  > div:first-child {
    > .Element-Button:last-child {
      margin-left: 8px;
    }
  }
`
