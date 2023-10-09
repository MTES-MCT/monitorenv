import { Accent, Button, FormikTextInput, Icon, IconButton, THEME, useKey } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { useCallback } from 'react'
import styled from 'styled-components'

import { CONTROL_UNIT_CONTACT_FORM_SCHEMA } from './constants'
import { FormikNameSelect } from './FormikNameSelect'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { mainWindowActions } from '../../../../MainWindow/slice'
import { MainWindowConfirmationModalActionType } from '../../../../MainWindow/types'

import type { ControlUnitContactFormValues } from './types'

export type FormProps = {
  initialValues: ControlUnitContactFormValues
  isNew: boolean
  onCancel: () => void
  onSubmit: (controlUnitContactFormValues: ControlUnitContactFormValues) => void
}
export function Form({ initialValues, isNew, onCancel, onSubmit }: FormProps) {
  const dispatch = useAppDispatch()
  const key = useKey([initialValues])

  const askForDeletionConfirmation = useCallback(async () => {
    if (!initialValues.id) {
      return
    }

    dispatch(
      mainWindowActions.openConfirmationModal({
        actionType: MainWindowConfirmationModalActionType.DELETE_CONTROL_UNIT_CONTACT,
        entityId: initialValues.id,
        modalProps: {
          color: THEME.color.maximumRed,
          confirmationButtonLabel: 'Supprimer',
          iconName: 'Delete',
          message: `Êtes-vous sûr de vouloir supprimer ce contact ?`,
          title: `Suppression du contact`
        }
      })
    )
  }, [initialValues.id, dispatch])

  return (
    <Formik
      key={key}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={CONTROL_UNIT_CONTACT_FORM_SCHEMA}
    >
      {({ handleSubmit }) => (
        <>
          <Title>Ajouter un contact</Title>
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
              {!isNew && (
                <IconButton
                  accent={Accent.SECONDARY}
                  color={THEME.color.maximumRed}
                  Icon={Icon.Delete}
                  onClick={askForDeletionConfirmation}
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
