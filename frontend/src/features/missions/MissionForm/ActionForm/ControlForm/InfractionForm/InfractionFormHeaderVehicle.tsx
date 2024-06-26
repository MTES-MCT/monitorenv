import { VesselTypeSelector } from '@features/commonComponents/VesselTypeSelector'
import { FormikNumberInput, FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled from 'styled-components'

import { VehicleTypeEnum } from '../../../../../../domain/entities/vehicleType'

import type { EnvActionControl } from '../../../../../../domain/entities/missions'

export function InfractionFormHeaderVehicle({ envActionIndex, infractionPath }) {
  const [vehicleTypeField] = useField<EnvActionControl['vehicleType']>(`envActions.${envActionIndex}.vehicleType`)

  return (
    <FormGroup>
      {vehicleTypeField?.value !== VehicleTypeEnum.VESSEL && (
        <>
          <FormikTextInput
            data-cy="infraction-form-registrationNumber"
            label="Immatriculation"
            name={`${infractionPath}.registrationNumber`}
          />

          <FormikTextInput
            data-cy="infraction-form-controlledPersonIdentity"
            label="Identité de la personne contrôlée"
            name={`${infractionPath}.controlledPersonIdentity`}
          />
        </>
      )}

      {vehicleTypeField?.value === VehicleTypeEnum.VESSEL && (
        <>
          <StyledVesselForm>
            <FormikTextInput label="MMSI" name={`${infractionPath}.mmsi`} />
            <FormikTextInput
              data-cy="infraction-form-vesselName"
              label="Nom du navire"
              name={`${infractionPath}.vesselName`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <FormikTextInput label="IMO" name={`${infractionPath}.imo`} />
            <FormikTextInput
              data-cy="infraction-form-controlledPersonIdentity"
              label="Nom du capitaine"
              name={`${infractionPath}.controlledPersonIdentity`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <FormikTextInput
              data-cy="infraction-form-registrationNumber"
              label="Immatriculation"
              name={`${infractionPath}.registrationNumber`}
            />
            <FormikNumberInput
              data-cy="infraction-form-vessel-size"
              label="Taille"
              name={`${infractionPath}.vesselSize`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <VesselTypeSelector name={`${infractionPath}.vesselType`} style={{ flex: '0 1 48.5%' }} />
          </StyledVesselForm>
        </>
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
