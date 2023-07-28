import {
  Accent,
  Button,
  FormikNumberInput,
  FormikTextInput,
  Icon,
  IconButton,
  Label,
  useForceUpdate,
  usePrevious
} from '@mtes-mct/monitor-ui'
import { useEffect } from 'react'
import styled from 'styled-components'

import { TargetTypeEnum } from '../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../domain/entities/vehicleType'
import { StyledCompanyContainer, StyledEmptyTarget, StyledVesselContainer, StyledVesselForm } from '../../style'

export function TargetDetails({ form, push, remove }) {
  // Ensure that the component is re-rendered when the number of targets changes
  // -> use of index as key in targetDetaiils.map()
  const { forceUpdate } = useForceUpdate()

  const numberOfTargets = form?.values?.targetDetails?.length || 0
  const previousNumberOfTargets = usePrevious(numberOfTargets)

  useEffect(() => {
    if (numberOfTargets !== previousNumberOfTargets) {
      forceUpdate()
    }
  }, [forceUpdate, numberOfTargets, previousNumberOfTargets])

  const handleAddTargetDetails = () => {
    push({})
  }
  const handleRemoveTargetDetails = index => () => {
    remove(index)
  }

  return (
    <>
      <Container>
        <Label>Détail de la cible du signalement</Label>
        {(!form.values.targetType ||
          (form.values.targetType === TargetTypeEnum.VEHICLE && !form.values.vehicleType)) && (
          <StyledEmptyTarget>
            <span>Aucune cible ajoutée pour le moment</span>
          </StyledEmptyTarget>
        )}
        {form?.values.targetDetails?.length > 0
          ? form.values.targetDetails.map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TargetWrapper key={`${index}`}>
                {form.values.targetType === TargetTypeEnum.COMPANY && (
                  <StyledCompanyContainer>
                    <FormikTextInput isLight label="Nom de la société" name={`targetDetails.${index}.operatorName`} />
                    <FormikTextInput
                      isLight
                      label="Identité de la personne"
                      name={`targetDetails.${index}.vesselName`}
                    />
                  </StyledCompanyContainer>
                )}
                {form.values.targetType === TargetTypeEnum.INDIVIDUAL && (
                  <StyledCompanyContainer>
                    <FormikTextInput
                      isLight
                      label="Identité de la personne"
                      name={`targetDetails.${index}.operatorName`}
                    />
                  </StyledCompanyContainer>
                )}
                {form.values.targetType === TargetTypeEnum.VEHICLE &&
                  form.values.vehicleType &&
                  form.values.vehicleType !== VehicleTypeEnum.VESSEL && (
                    <StyledVesselContainer>
                      <FormikTextInput
                        isLight
                        label="Immatriculation"
                        name={`targetDetails.${index}.externalReferenceNumber`}
                      />
                      <FormikTextInput
                        isLight
                        label="Identité de la personne contrôlée"
                        name={`targetDetails.${index}.operatorName`}
                      />
                    </StyledVesselContainer>
                  )}
                {form.values.targetType === TargetTypeEnum.VEHICLE &&
                  form.values.vehicleType === VehicleTypeEnum.VESSEL && (
                    <StyledVesselContainer>
                      <StyledVesselForm>
                        <FormikTextInput isLight label="MMSI" name={`targetDetails.${index}.mmsi`} />
                        <FormikTextInput isLight label="Nom du navire" name={`targetDetails.${index}.vesselName`} />
                      </StyledVesselForm>
                      <StyledVesselForm>
                        <FormikTextInput isLight label="IMO" name={`targetDetails.${index}.imo`} />
                        <FormikTextInput
                          isLight
                          label="Nom du capitaine"
                          name={`targetDetails.${index}.operatorName`}
                        />
                      </StyledVesselForm>
                      <StyledVesselForm>
                        <FormikTextInput
                          isLight
                          label="Immatriculation"
                          name={`targetDetails.${index}.externalReferenceNumber`}
                        />
                        <FormikNumberInput isLight label="Taille" name={`targetDetails.${index}.size`} />
                      </StyledVesselForm>
                    </StyledVesselContainer>
                  )}
                {index > 0 && (
                  <IconButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={handleRemoveTargetDetails(index)} />
                )}
              </TargetWrapper>
            ))
          : null}
      </Container>
      {form.values.targetType === TargetTypeEnum.VEHICLE && !!form.values.vehicleType && (
        <Button accent={Accent.SECONDARY} onClick={handleAddTargetDetails}>
          Ajouter une cible
        </Button>
      )}
    </>
  )
}

const Container = styled.div``

const TargetWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`
