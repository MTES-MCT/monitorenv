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
        <FormikTextInput
          data-cy="infraction-form-registrationNumber"
          label="Immatriculation"
          name={`${infractionPath}.registrationNumber`}
        />
      )}

      {
        vehicleTypeField?.value === VehicleTypeEnum.VESSEL && (
          <>
            <StyledVesselForm>
              <FormikTextInput label="MMSI" name={`${infractionPath}.mmsi`} />
              <FormikTextInput label="Nom du navire" name={`${infractionPath}.vesselName`} />
            </StyledVesselForm>
            <StyledVesselForm>
              <FormikTextInput label="IMO" name={`${infractionPath}.imo`} />
              <FormikTextInput label="Nom du capitaine" name={`${infractionPath}.controlledPersonIdentity`} />
            </StyledVesselForm>
            <StyledVesselForm>
              <FormikTextInput label="Immatriculation" name={`${infractionPath}.registrationNumber`} />
              <FormikNumberInput label="Taille" name={`${infractionPath}.vesselSize`} />
            </StyledVesselForm>
            <StyledVesselForm>
              <VesselTypeSelector name={`${infractionPath}.vesselType`} />
            </StyledVesselForm>
          </>
        )
        /*  <>
          <VesselTypeSelector name={`${infractionPath}.vesselType`} />

          <FormikNumberInput
            data-cy="infraction-form-vessel-size"
            label="Taille du navire"
            min={0}
            name={`${infractionPath}.vesselSize`}
          />
        </> */
      }
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
