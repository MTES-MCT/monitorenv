import { VesselForm } from '@features/Vessel/VesselForm'
import { FormikTextInput, LinkButton } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled from 'styled-components'

import { VehicleTypeEnum } from '../../../../../../../domain/entities/vehicleType'

import type { EnvActionControl } from '../../../../../../../domain/entities/missions'

type InfractionHeaderType = {
  envActionIndex: number
  infractionPath: string
  isDisabled: boolean
}

export function InfractionFormHeaderVehicle({ envActionIndex, infractionPath, isDisabled }: InfractionHeaderType) {
  const [vehicleTypeField] = useField<EnvActionControl['vehicleType']>(`envActions.${envActionIndex}.vehicleType`)

  return (
    <FormGroup>
      {vehicleTypeField?.value !== VehicleTypeEnum.VESSEL && (
        <>
          <FormikTextInput
            data-cy="infraction-form-registrationNumber"
            disabled={isDisabled}
            isErrorMessageHidden
            isUndefinedWhenDisabled
            label="Immatriculation"
            name={`${infractionPath}.registrationNumber`}
          />

          <FormikTextInput
            data-cy="infraction-form-controlledPersonIdentity"
            disabled={isDisabled}
            isErrorMessageHidden
            isUndefinedWhenDisabled
            label="Identité de la personne contrôlée"
            name={`${infractionPath}.controlledPersonIdentity`}
          />
        </>
      )}

      {vehicleTypeField?.value === VehicleTypeEnum.VESSEL && (
        <VesselForm envActionIndex={envActionIndex} isDisabled={isDisabled} path={infractionPath} />
      )}
    </FormGroup>
  )
}

const FormGroup = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
`
export const StyledVesselForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;

  > .Field-TextInput,
  .Field-NumberInput {
    flex: 1;
  }
`

export const VesselSearchInputWrapper = styled.div`
  display: flex;
  position: relative;
`

export const VesselSearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const StyledLinkButton = styled(LinkButton)`
  position: absolute;
  right: 32px;
  transform: translateY(50%);
`
