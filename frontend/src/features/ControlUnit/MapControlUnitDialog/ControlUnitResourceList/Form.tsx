import {
  Accent,
  Button,
  FormikSelect,
  FormikTextInput,
  FormikTextarea,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum,
  useKey
} from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import styled from 'styled-components'

import { INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES } from './constants'
import { useGetBasesQuery } from '../../../../api/base'
import { ControlUnit } from '../../../../domain/entities/ControlUnit/types'

import type { ControlUnitResourceFormValues } from './types'

export type FormProps = {
  initialValues: ControlUnitResourceFormValues | undefined
  onCancel: () => void
  onSubmit: (controlUnitResourceFormValues: ControlUnitResourceFormValues) => void
}
export function Form({ initialValues = INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES, onCancel, onSubmit }: FormProps) {
  const key = useKey([initialValues])

  const { data: bases } = useGetBasesQuery()

  const basesAsOptions = getOptionsFromIdAndName(bases)
  const controlUnitResourceTypesAsOptions = getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceType)

  if (!basesAsOptions) {
    return <div>Chargement en cours...</div>
  }

  return (
    <Formik key={key} initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <StyledForm onSubmit={handleSubmit}>
          <p>Ajouter un moyen</p>

          <FormikTextInput isLight label="Nom du moyen" name="name" />
          <FormikSelect isLight label="Type de moyen" name="type" options={controlUnitResourceTypesAsOptions} />
          <FormikSelect isLight label="Base du moyen" name="baseId" options={basesAsOptions} />
          <FormikTextarea isLight label="Commentaire" name="note" />

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
