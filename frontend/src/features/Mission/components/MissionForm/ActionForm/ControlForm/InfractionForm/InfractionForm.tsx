import { Tooltip } from '@components/Tooltip'
import { NewInfractionSchema } from '@features/Mission/components/MissionForm/Schemas/Infraction'
import { Accent, Button, FormikMultiRadio, FormikNumberInput, FormikTextarea, Icon } from '@mtes-mct/monitor-ui'
import {
  administrativeResponseOptions,
  formalNoticeLabels,
  type Infraction,
  infractionSeizureLabels,
  infractionTypeLabels
} from 'domain/entities/missions'
import { TargetTypeEnum } from 'domain/entities/targetType'
import { useField } from 'formik'
import { type MouseEventHandler } from 'react'
import styled from 'styled-components'

import { InfractionFormHeaderCompany } from './InfractionFormHeaderCompany'
import { InfractionFormHeaderIndividual } from './InfractionFormHeaderIndividual'
import { InfractionFormHeaderVehicle } from './InfractionFormHeaderVehicle'
import { NatinfSelector } from './NatinfSelector'

const infractionTypeOptions = Object.values(infractionTypeLabels).map(o => ({ label: o.libelle, value: o.code }))
const formalNoticeOptions = Object.values(formalNoticeLabels).map(o => ({ label: o.libelle, value: o.code }))
const infractionSeizureOptions = Object.values(infractionSeizureLabels).map(o => ({ label: o.libelle, value: o.code }))

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
  const [infraction] = useField<Infraction>(infractionPath)
  const [actionTargetField] = useField<string>(`envActions.${envActionIndex}.actionTargetType`)
  const [nbTarget] = useField<number>(`${infractionPath}.nbTarget`)

  const isValid = () => {
    try {
      NewInfractionSchema.validateSync(infraction.value)

      return true
    } catch (error) {
      return false
    }
  }

  const disableIdentificationFields = nbTarget.value > 1

  return (
    <FormWrapper data-cy="infraction-form">
      {actionTargetField.value === TargetTypeEnum.VEHICLE && (
        <InfractionFormHeaderVehicle
          envActionIndex={envActionIndex}
          infractionPath={infractionPath}
          isDisabled={disableIdentificationFields}
        />
      )}

      {actionTargetField.value === TargetTypeEnum.COMPANY && (
        <InfractionFormHeaderCompany infractionPath={infractionPath} isDisabled={disableIdentificationFields} />
      )}

      {actionTargetField.value === TargetTypeEnum.INDIVIDUAL && (
        <InfractionFormHeaderIndividual infractionPath={infractionPath} isDisabled={disableIdentificationFields} />
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
        label="Appréhension/saisie"
        name={`${infractionPath}.seizure`}
        options={infractionSeizureOptions}
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

      <FormikTextarea label="Observations" name={`${infractionPath}.observations`} />

      <NbTargetWrapper>
        <NbTargetInput
          data-cy="infraction-form-nbTarget"
          isRequired
          label="Nb de cibles avec cette infraction"
          min={1}
          name={`${infractionPath}.nbTarget`}
        />
        <StyledTooltip Icon={Icon.AttentionFilled} isSideWindow orientation="TOP_LEFT">
          Ne déclarez plusieurs cibles dans une infraction que dans le cas où les unités n&apos;ont pas transmis de
          données permettant de les identifier (nom, immatriculation…)
        </StyledTooltip>
      </NbTargetWrapper>

      <ButtonContainer>
        <Button accent={Accent.TERTIARY} onClick={removeInfraction}>
          Supprimer l&apos;infraction
        </Button>
        <Button data-cy="infraction-form-validate" disabled={!isValid()} onClick={validateInfraction}>
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`
const NbTargetWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: end;
`
const StyledTooltip = styled(Tooltip)`
  display: flex;
  width: 50%;
`
const NbTargetInput = styled(FormikNumberInput)`
  width: 48.5%;
`
