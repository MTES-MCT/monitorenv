import { Accent, Button, FormikCheckbox, FormikMultiRadio, FormikTextarea, FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled from 'styled-components'

import { InfractionFormHeaderCompany } from './InfractionFormHeaderCompany'
import { InfractionFormHeaderVehicle } from './InfractionFormHeaderVehicle'
import { NatinfSelector } from './NatinfSelector'
import { RelevantCourtSelector } from './RelevantCourtSelector'
import { infractionTypeLabels, formalNoticeLabels } from '../../../../../../domain/entities/missions'
import { TargetTypeEnum } from '../../../../../../domain/entities/targetType'

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

  return (
    <FormWrapper data-cy="infraction-form">
      {actionTargetField.value === TargetTypeEnum.VEHICLE && (
        <InfractionFormHeaderVehicle envActionIndex={envActionIndex} infractionPath={infractionPath} />
      )}

      {actionTargetField.value === TargetTypeEnum.COMPANY && (
        <InfractionFormHeaderCompany infractionPath={infractionPath} />
      )}

      <FormikTextInput
        data-cy="infraction-form-controlledPersonIdentity"
        label="Identité de la personne contrôlée"
        name={`${infractionPath}.controlledPersonIdentity`}
      />

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
        <Button data-cy="infraction-form-validate" onClick={validateInfraction}>
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
