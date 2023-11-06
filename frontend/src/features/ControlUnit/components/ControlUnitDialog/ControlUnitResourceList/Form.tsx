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
import styled from 'styled-components'

import { CONTROL_UNIT_RESOURCE_FORM_SCHEMA, CONTROL_UNIT_RESOURCE_TYPES_AS_OPTIONS } from './constants'
import { useGetBasesQuery } from '../../../../../api/basesAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../../api/constants'

import type { ControlUnitResourceFormValues } from './types'
import type { Promisable } from 'type-fest'

export type FormProps = {
  initialValues: ControlUnitResourceFormValues
  marginTop?: number
  onArchive?: () => Promisable<void>
  onCancel: () => Promisable<void>
  onDelete?: () => Promisable<void>
  onSubmit: (controlUnitResourceFormValues: ControlUnitResourceFormValues) => void
}
export function Form({ initialValues, marginTop, onArchive, onCancel, onDelete, onSubmit }: FormProps) {
  const key = useKey([initialValues])
  const isNew = !initialValues.id

  const { data: bases } = useGetBasesQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const basesAsOptions = getOptionsFromIdAndName(bases)?.filter(baseAsOption => baseAsOption.value !== 0)

  if (!basesAsOptions) {
    return <div>Chargement en cours...</div>
  }

  return (
    <Formik
      key={key}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={CONTROL_UNIT_RESOURCE_FORM_SCHEMA}
    >
      {({ handleSubmit }) => (
        <>
          <Title style={{ marginTop }}>{isNew ? 'Ajouter un moyen' : 'Éditer un moyen'}</Title>
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
              {onArchive && (
                <IconButton
                  accent={Accent.SECONDARY}
                  Icon={Icon.Archive}
                  onClick={onArchive}
                  style={{ padding: '0 4px' }}
                  title="Archiver ce moyen"
                />
              )}
              {onDelete && (
                <IconButton
                  accent={Accent.SECONDARY}
                  color={THEME.color.maximumRed}
                  Icon={Icon.Delete}
                  onClick={onDelete}
                  // TODO Add `borderColor` in Monitor UI.
                  style={{ borderColor: THEME.color.maximumRed, padding: '0 4px' }}
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
  margin: 0 0 2px;
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
