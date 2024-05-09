import { Mission } from '@features/Mission/mission.type'
import { FormikNumberInput, FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled from 'styled-components'

import { VesselTypeSelector } from './VesselTypeSelector'
import { VehicleTypeEnum } from '../../../../../../../domain/entities/vehicleType'

export function InfractionFormHeaderVehicle({ envActionIndex, infractionPath }) {
  const [vehicleTypeField] = useField<Mission.EnvActionControl['vehicleType']>(
    `envActions.${envActionIndex}.vehicleType`
  )

  return (
    <FormGroup>
      <FormikTextInput
        data-cy="infraction-form-registrationNumber"
        label="Immatriculation"
        name={`${infractionPath}.registrationNumber`}
      />

      {vehicleTypeField?.value === VehicleTypeEnum.VESSEL && (
        <>
          <VesselTypeSelector infractionPath={infractionPath} />

          <FormikNumberInput
            data-cy="infraction-form-vessel-size"
            label="Taille du navire"
            min={0}
            name={`${infractionPath}.vesselSize`}
          />
        </>
      )}
    </FormGroup>
  )
}

const FormGroup = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;
`
