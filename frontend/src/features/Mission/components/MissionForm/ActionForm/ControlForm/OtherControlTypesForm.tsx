import { ControlUnit, FormikCheckbox } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import type { Mission } from '../../../../../../domain/entities/missions'

export function OtherControlTypesForm({ currentActionIndex }: { currentActionIndex: number }) {
  const {
    values: { controlUnits }
  } = useFormikContext<Mission>()

  const currentControlUnitIsPAM = controlUnits.some(controlUnit =>
    ControlUnit.PAMControlUnitIds.includes(controlUnit.id)
  )

  if (!currentControlUnitIsPAM) {
    return null
  }

  return (
    <div>
      <Label>Autre(s) contrôle(s) effectué(s) par l’unité sur le navire</Label>
      <StyledFormikCheckbox
        label="Contrôle administratif"
        name={`envActions[${currentActionIndex}].isAdministrativeControl`}
      />
      <StyledFormikCheckbox
        label="Respect du code de la navigation sur le plan d’eau"
        name={`envActions[${currentActionIndex}].isComplianceWithWaterRegulationsControl`}
      />
      <StyledFormikCheckbox label="Gens de mer" name={`envActions[${currentActionIndex}].isSeafarersControl`} />
      <StyledFormikCheckbox
        label="Equipement de sécurité et respect des normes"
        name={`envActions[${currentActionIndex}].isSafetyEquipmentAndStandardsComplianceControl`}
      />
    </div>
  )
}

const Label = styled.span`
  font-size: 13px;
  line-height: 22px;
  display: inline-block;
  color: ${p => p.theme.color.slateGray};
`

const StyledFormikCheckbox = styled(FormikCheckbox)`
  height: 50px;
  background-color: ${p => p.theme.color.white};
  margin-bottom: 4px;
  justify-content: center;
  padding: 16px;
`
