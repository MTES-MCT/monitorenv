import {
  Accent,
  Button,
  FormikNumberInput,
  FormikTextInput,
  Icon,
  Label,
  THEME,
  useForceUpdate,
  usePrevious
} from '@mtes-mct/monitor-ui'
import { useEffect } from 'react'
import styled from 'styled-components'

import { TargetTypeEnum } from '../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../domain/entities/vehicleType'
import { StyledEmptyTarget, StyledVesselContainer, StyledVesselForm } from '../../style'

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
        {(!form.values.targetType ||
          (form.values.targetType === TargetTypeEnum.VEHICLE && !form.values.vehicleType)) && (
          <>
            <Label>Détail de la cible du signalement</Label>
            <StyledEmptyTarget>
              <span>Aucune cible ajoutée pour le moment</span>
            </StyledEmptyTarget>
          </>
        )}
        {form?.values.targetDetails?.length > 0
          ? form.values.targetDetails.map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TargetWrapper key={`${index}`}>
                <Label>
                  Détail de la cible du signalement{' '}
                  {form?.values.targetDetails?.length > 1 && <TargetNumber>{`(cible ${index + 1})`}</TargetNumber>}
                </Label>
                <StyledVesselContainer>
                  {form.values.targetType === TargetTypeEnum.COMPANY && (
                    <>
                      <FormikTextInput isLight label="Nom de la société" name={`targetDetails.${index}.operatorName`} />
                      <FormikTextInput
                        isLight
                        label="Identité de la personne"
                        name={`targetDetails.${index}.vesselName`}
                      />
                    </>
                  )}
                  {form.values.targetType === TargetTypeEnum.INDIVIDUAL && (
                    <FormikTextInput
                      isLight
                      label="Identité de la personne"
                      name={`targetDetails.${index}.operatorName`}
                    />
                  )}
                  {form.values.targetType === TargetTypeEnum.VEHICLE &&
                    form.values.vehicleType &&
                    form.values.vehicleType !== VehicleTypeEnum.VESSEL && (
                      <>
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
                      </>
                    )}
                  {form.values.targetType === TargetTypeEnum.VEHICLE &&
                    form.values.vehicleType === VehicleTypeEnum.VESSEL && (
                      <>
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
                      </>
                    )}
                  {index > 0 && (
                    <CancelTarget onClick={handleRemoveTargetDetails(index)}>
                      <Icon.Delete color={THEME.color.maximumRed} size={16} />
                      Supprimer cette cible
                    </CancelTarget>
                  )}
                </StyledVesselContainer>
              </TargetWrapper>
            ))
          : null}
      </Container>
      {form.values.targetType === TargetTypeEnum.VEHICLE && !!form.values.vehicleType && (
        <Button accent={Accent.SECONDARY} Icon={Icon.Plus} onClick={handleAddTargetDetails}>
          Ajouter une cible
        </Button>
      )}
    </>
  )
}

const Container = styled.div``

const TargetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`

const TargetNumber = styled.span`
  font-weight: 700;
`

const CancelTarget = styled.div`
  align-self: flex-end;
  display: flex;
  cursor: pointer;
  > .Element-IconBox {
    margin-top: 2px;
    margin-right: 4px;
  }
  color: ${THEME.color.maximumRed};
`
