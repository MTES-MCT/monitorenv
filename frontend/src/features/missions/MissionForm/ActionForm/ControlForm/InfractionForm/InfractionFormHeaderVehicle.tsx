import { FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled from 'styled-components'

import { VesselSizeSelector } from './VesselSizeSelector'
import { VesselTypeSelector } from './VesselTypeSelector'
import { VehicleTypeEnum } from '../../../../../../domain/entities/vehicleType'

import type { EnvActionControl, Infraction } from '../../../../../../domain/entities/missions'

export function InfractionFormHeaderVehicle({ envActionIndex, infractionPath }) {
  const [vehicleTypeField] = useField<EnvActionControl['vehicleType']>(`envActions.${envActionIndex}.vehicleType`)
  const [vesselTypeField, , vesselTypeHelpers] = useField<Infraction['vesselType']>(`${infractionPath}.vesselType`)
  const [vesselSizeField, , vesselSizeHelpers] = useField<Infraction['vesselSize']>(`${infractionPath}.vesselSize`)

  const handleChangeVesselType = v => {
    vesselTypeHelpers.setValue(v)
  }

  const handleChangeVesselSize = v => {
    vesselSizeHelpers.setValue(v)
  }

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
            <VesselTypeSelector onChange={handleChangeVesselType} value={vesselTypeField.value} />
          </FormColumn>

          <FormColumn>
            <VesselSizeSelector onChange={handleChangeVesselSize} value={vesselSizeField.value} />
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
