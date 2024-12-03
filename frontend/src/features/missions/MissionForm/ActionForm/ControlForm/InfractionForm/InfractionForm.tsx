import { NewInfractionSchema } from '@features/missions/MissionForm/Schemas/Infraction'
import { Accent, Button, FormikMultiRadio, FormikNumberInput, FormikTextarea, Icon, THEME } from '@mtes-mct/monitor-ui'
import {
  administrativeResponseOptions,
  formalNoticeLabels,
  infractionSeizureLabels,
  infractionTypeLabels,
  type Infraction
} from 'domain/entities/missions'
import { TargetTypeEnum } from 'domain/entities/targetType'
import { useField } from 'formik'
import { useState, type MouseEventHandler } from 'react'
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
  const [isVisibleTooltip, setIsVisibleTooltip] = useState<boolean>(false)

  const showTooltip = () => setIsVisibleTooltip(true)
  const hideTooltip = () => setIsVisibleTooltip(false)
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
        <IconAndMessageWrapper>
          <StyledIconAttention
            aria-describedby="nbTargetTooltip"
            color={THEME.color.slateGray}
            onBlur={hideTooltip}
            onFocus={showTooltip}
            onMouseLeave={hideTooltip}
            onMouseOver={showTooltip}
            tabIndex={0}
          />
          {isVisibleTooltip && (
            <StyledTooltip id="nbTargetTooltip" role="tooltip">
              Ne déclarez plusieurs cibles dans une infraction que dans le cas où les unités n&apos;ont pas transmis de
              données permettant de les identifier (nom, immatriculation…)
            </StyledTooltip>
          )}
        </IconAndMessageWrapper>
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
const IconAndMessageWrapper = styled.div`
  display: flex;
  width: 50%;
  position: relative;
  margin-bottom: 6px;
`
const StyledTooltip = styled.p`
  background: ${p => p.theme.color.cultured};
  border: ${p => p.theme.color.lightGray} 1px solid;
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
  font-size: 13px;
  padding: 8px;

  position: absolute;
  left: 29px;
  top: -20px;
`
const NbTargetInput = styled(FormikNumberInput)`
  width: 48.5%;
`
const StyledIconAttention = styled(Icon.AttentionFilled)`
  cursor: pointer;
`
