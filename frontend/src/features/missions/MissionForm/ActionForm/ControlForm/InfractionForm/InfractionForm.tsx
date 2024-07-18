import { Accent, Button, FormikCheckbox, FormikMultiRadio, FormikTextarea } from '@mtes-mct/monitor-ui'
import {
  administrativeResponseOptions,
  type EnvActionControl,
  formalNoticeLabels,
  infractionTypeLabels,
  type Mission
} from 'domain/entities/missions'
import { TargetTypeEnum } from 'domain/entities/targetType'
import { type FormikErrors, useField, useFormikContext } from 'formik'
import styled from 'styled-components'

import { InfractionFormHeaderCompany } from './InfractionFormHeaderCompany'
import { InfractionFormHeaderIndividual } from './InfractionFormHeaderIndividual'
import { InfractionFormHeaderVehicle } from './InfractionFormHeaderVehicle'
import { NatinfSelector } from './NatinfSelector'
import { RelevantCourtSelector } from './RelevantCourtSelector'

import type { MouseEventHandler } from 'react'

const infractionTypeOptions = Object.values(infractionTypeLabels).map(o => ({ label: o.libelle, value: o.code }))
const formalNoticeOptions = Object.values(formalNoticeLabels).map(o => ({ label: o.libelle, value: o.code }))

type InfractionFormProps = {
  currentInfractionIndex: number
  envActionIndex: number
  removeInfraction: MouseEventHandler
  validateInfraction: MouseEventHandler
}

export function InfractionForm({
  currentInfractionIndex,
  envActionIndex,
  removeInfraction,
  validateInfraction
}: InfractionFormProps) {
  const infractionPath = `envActions[${envActionIndex}].infractions[${currentInfractionIndex}]`

  const [actionTargetField] = useField<string>(`envActions.${envActionIndex}.actionTargetType`)

  const { errors } = useFormikContext<Mission>()

  function isInfractionFormInvalid(errorsForm: FormikErrors<Mission>) {
    const envActionErrors = (!!errorsForm.envActions &&
      errorsForm.envActions[envActionIndex]) as FormikErrors<EnvActionControl>

    return envActionErrors && !!envActionErrors.infractions
  }

  const isInvalid = isInfractionFormInvalid(errors)

  return (
    <FormWrapper data-cy="infraction-form">
      {actionTargetField.value === TargetTypeEnum.VEHICLE && (
        <InfractionFormHeaderVehicle envActionIndex={envActionIndex} infractionPath={infractionPath} />
      )}

      {actionTargetField.value === TargetTypeEnum.COMPANY && (
        <InfractionFormHeaderCompany infractionPath={infractionPath} />
      )}

      {actionTargetField.value === TargetTypeEnum.INDIVIDUAL && (
        <InfractionFormHeaderIndividual infractionPath={infractionPath} />
      )}

      <FormikMultiRadio
        isErrorMessageHidden
        isInline
        isRequired
        label="Type d'infraction"
        name={`${infractionPath}.infractionType`}
        options={infractionTypeOptions}
      />

      <FormikMultiRadio
        isErrorMessageHidden
        isInline
        isRequired
        label="Réponse administrative"
        name={`${infractionPath}.administrativeResponse`}
        options={administrativeResponseOptions}
      />

      <FormikMultiRadio
        isErrorMessageHidden
        isInline
        isRequired
        label="Mise en demeure"
        name={`${infractionPath}.formalNotice`}
        options={formalNoticeOptions}
      />

      <NatinfSelector infractionPath={infractionPath} />

      <FormColumnWithCheckbox>
        <RelevantCourtSelector infractionPath={infractionPath} />
        <FormikCheckbox inline label="A traiter" name={`${infractionPath}.toProcess`} />
      </FormColumnWithCheckbox>

      <FormikTextarea label="Observations" name={`${infractionPath}.observations`} />

      <ButtonContainer>
        <Button accent={Accent.TERTIARY} onClick={removeInfraction}>
          Supprimer l&apos;infraction
        </Button>
        <Button data-cy="infraction-form-validate" disabled={isInvalid} onClick={validateInfraction}>
          Valider l&apos;infraction
        </Button>
      </ButtonContainer>
    </FormWrapper>
  )
}

const FormWrapper = styled.div`
  background: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
`

const FormColumnWithCheckbox = styled.div`
  align-items: end;
  display: flex;
  gap: 16px;

  > .Field-Checkbox {
    padding-bottom: 12px;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`
