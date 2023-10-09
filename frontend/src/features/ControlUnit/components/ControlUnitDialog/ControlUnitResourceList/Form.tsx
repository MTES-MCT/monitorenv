import {
  Accent,
  Button,
  FormikSelect,
  FormikTextInput,
  FormikTextarea,
  Icon,
  IconButton,
  THEME,
  getOptionsFromIdAndName,
  useKey
} from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import { useCallback } from 'react'
import styled from 'styled-components'

import { CONTROL_UNIT_RESOURCE_FORM_SCHEMA, CONTROL_UNIT_RESOURCE_TYPES_AS_OPTIONS } from './constants'
import { useGetBasesQuery } from '../../../../../api/basesAPI'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { mainWindowActions } from '../../../../MainWindow/slice'
import { MainWindowConfirmationModalActionType } from '../../../../MainWindow/types'

import type { ControlUnitResourceFormValues } from './types'

export type FormProps = {
  initialValues: ControlUnitResourceFormValues
  isNew: boolean
  onCancel: () => void
  onSubmit: (controlUnitResourceFormValues: ControlUnitResourceFormValues) => void
}
export function Form({ initialValues, isNew, onCancel, onSubmit }: FormProps) {
  const dispatch = useAppDispatch()
  const key = useKey([initialValues])

  const { data: bases } = useGetBasesQuery()

  const basesAsOptions = getOptionsFromIdAndName(bases)?.filter(baseAsOption => baseAsOption.value !== 0)

  const askForDeletionConfirmation = useCallback(async () => {
    if (!initialValues.id) {
      return
    }

    dispatch(
      mainWindowActions.openConfirmationModal({
        actionType: MainWindowConfirmationModalActionType.DELETE_CONTROL_UNIT_RESOURCE,
        entityId: initialValues.id,
        modalProps: {
          color: THEME.color.maximumRed,
          confirmationButtonLabel: 'Supprimer',
          iconName: 'Delete',
          message: `Êtes-vous sûr de vouloir supprimer ce moyen ?`,
          title: `Suppression du moyen`
        }
      })
    )
  }, [initialValues.id, dispatch])

  if (!basesAsOptions) {
    return <div>Chargement en cours...</div>
  }

  return (
    <Formik
      key={key}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={CONTROL_UNIT_RESOURCE_FORM_SCHEMA}
    >
      {({ handleSubmit }) => (
        <>
          <Title>Ajouter un moyen</Title>
          <StyledForm onSubmit={handleSubmit}>
            <FormikSelect isLight label="Type de moyen" name="type" options={CONTROL_UNIT_RESOURCE_TYPES_AS_OPTIONS} />
            <FormikTextInput isLight label="Nom du moyen" name="name" />
            <FormikSelect isLight label="Base du moyen" name="baseId" options={basesAsOptions} />
            <FormikTextarea isLight label="Commentaire" name="note" />

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
                  title="Supprimer ce moyen"
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
  line-height: 1.3846;
`

const StyledForm = styled.form`
  background-color: ${p => p.theme.color.gainsboro};
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

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;

  > div:first-child {
    > .Element-Button:last-child {
      margin-left: 8px;
    }
  }
`
