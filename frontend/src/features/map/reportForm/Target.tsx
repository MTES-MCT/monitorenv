import { FormikNumberInput, FormikTextInput, Label } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'

import { TargetTypeEnum } from '../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../domain/entities/vehicleType'
import { TargetSelector } from '../../commonComponents/TargetSelector'
import { VehicleTypeSelector } from '../../commonComponents/VehicleTypeSelector'
import { StyledCompanyContainer, StyledEmptyTarget, StyledInlineContainer, StyledVesselContainer } from './style'

import type { Report } from '../../../domain/entities/report'

export function Target() {
  const { setFieldValue, values } = useFormikContext<Report>()

  const onVehicleTypeChange = selectedVehicleType => {
    setFieldValue('vehicleType', selectedVehicleType)
  }

  const onTargetTypeChange = selectedTarget => {
    setFieldValue('targetType', selectedTarget)
  }

  return (
    <>
      <StyledInlineContainer>
        <TargetSelector error="" name="targetType" onChange={onTargetTypeChange} value={values.targetType} />
        <VehicleTypeSelector
          disabled={values.targetType !== TargetTypeEnum.VEHICLE}
          error=""
          name="vehicleType"
          onChange={onVehicleTypeChange}
          value={values.vehicleType}
        />
      </StyledInlineContainer>

      <div>
        <Label>Détail de la cible du signalement</Label>
        {(!values.targetType || (values.targetType === TargetTypeEnum.VEHICLE && !values.vehicleType)) && (
          <StyledEmptyTarget>
            <span>Aucune cible ajoutée pour le moment</span>
          </StyledEmptyTarget>
        )}

        {values.targetType === TargetTypeEnum.COMPANY && (
          <StyledCompanyContainer>
            <FormikTextInput isLight label="Nom de la société" name="targetDetails.operatorName" />
            <FormikTextInput isLight label="Identité de la personne" name="targetDetails.vesselName" />
          </StyledCompanyContainer>
        )}
        {values.targetType === TargetTypeEnum.INDIVIDUAL && (
          <StyledCompanyContainer>
            <FormikTextInput isLight label="Identité de la personne" name="targetDetails.operatorName" />
          </StyledCompanyContainer>
        )}
        {values.targetType === TargetTypeEnum.VEHICLE && values.vehicleType === VehicleTypeEnum.VESSEL && (
          <StyledVesselContainer>
            <div>
              <FormikTextInput isLight label="MMSI" name="targetDetails.mmsi" />
              <FormikTextInput isLight label="Nom du navire" name="targetDetails.vesselName" />
            </div>
            <div>
              <FormikTextInput isLight label="IMO" name="targetDetails.imo" />
              <FormikTextInput isLight label="Nom du capitaine" name="targetDetails.operatorName" />
            </div>
            <div>
              <FormikTextInput isLight label="Immatriculation" name="targetDetails.externalReferenceNumber" />
              <FormikNumberInput isLight label="Taille" name="targetDetails.size" />
            </div>
          </StyledVesselContainer>
        )}
      </div>
    </>
  )
}
