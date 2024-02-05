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
      <FormColumn>
        <FormikTextInput
          data-cy="infraction-form-registrationNumber"
          label="Immatriculation"
          name={`${infractionPath}.registrationNumber`}
        />
      </FormColumn>
      {vehicleTypeField?.value === VehicleTypeEnum.VESSEL && (
        <>
          <FormColumn>
            <VesselTypeSelector infractionPath={infractionPath} />
          </FormColumn>

          <FormColumn>
            <VesselSizeSelector infractionPath={infractionPath} />
          </FormColumn>
        </>
      )}
    </FormGroup>
  )
}

const FormColumn = styled.div`
  display: inline-block;
  :not(:last-child) {
    margin-right: 6px;
  }
`
const FormGroup = styled.div`
  margin-bottom: 16px;
  height: 58px;
  display: flex;
`
