import { FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled from 'styled-components'

import { VesselSizeSelector } from './VesselSizeSelector'
import { VesselTypeSelector } from './VesselTypeSelector'
import { VehicleTypeEnum } from '../../../../../../domain/entities/vehicleType'

import type { EnvActionControl } from '../../../../../../domain/entities/missions'

export function InfractionFormHeaderVehicle({ envActionIndex, infractionPath }) {
  const [vehicleTypeField] = useField<EnvActionControl['vehicleType']>(`envActions.${envActionIndex}.vehicleType`)

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

          <VesselSizeSelector infractionPath={infractionPath} />
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
