import { StyledVesselForm } from '@features/Reportings/style'
import { Label, TextInput } from '@mtes-mct/monitor-ui'
import { ReportingTargetTypeEnum } from 'domain/entities/targetType'
import { VehicleTypeEnum } from 'domain/entities/vehicleType'
import styled from 'styled-components'

import { HistoryOfInfractions } from './HistoryOfInfractions'

import type { Reporting } from 'domain/entities/reporting'

const EMPTY_VALUE = '--'

export function TargetDetails({ isSuperUser, reporting }: { isSuperUser: boolean; reporting: Reporting }) {
  return (
    <>
      {reporting.targetType && reporting.targetType !== ReportingTargetTypeEnum.VEHICLE && (
        <TargetWrapper>
          <Label>Détail de la cible du signalement </Label>
          <StyledVesselContainer>
            {reporting.targetType === ReportingTargetTypeEnum.COMPANY && (
              <>
                <TextInput
                  isLight
                  label="Nom de la personne morale"
                  name="operatorName"
                  plaintext
                  value={reporting.targetDetails.length > 0 ? reporting.targetDetails[0]?.operatorName : EMPTY_VALUE}
                />
                <TextInput
                  isLight
                  label="Identité de la personne contrôlée"
                  name="vesselName"
                  plaintext
                  value={reporting.targetDetails.length > 0 ? reporting.targetDetails[0]?.vesselName : EMPTY_VALUE}
                />
              </>
            )}
            {reporting.targetType === ReportingTargetTypeEnum.INDIVIDUAL && (
              <TextInput
                isLight
                label="Identité de la personne"
                name="operatorName"
                plaintext
                value={reporting.targetDetails.length > 0 ? reporting?.targetDetails[0]?.operatorName : EMPTY_VALUE}
              />
            )}
          </StyledVesselContainer>
        </TargetWrapper>
      )}

      {reporting.targetType === ReportingTargetTypeEnum.VEHICLE &&
      reporting?.targetDetails &&
      reporting?.targetDetails?.length > 0
        ? reporting?.targetDetails.map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TargetWrapper key={index}>
              <Label>
                Détail de la cible du signalement{' '}
                {reporting.targetDetails && reporting.targetDetails?.length > 1 && (
                  <TargetNumber>{`(cible ${index + 1})`}</TargetNumber>
                )}
              </Label>
              <StyledVesselContainer>
                {reporting.vehicleType && reporting.vehicleType !== VehicleTypeEnum.VESSEL && (
                  <>
                    <TextInput
                      isLight
                      label="Immatriculation"
                      name={`targetDetails.${index}.externalReferenceNumber`}
                      plaintext
                      value={reporting.targetDetails[index]?.operatorName || EMPTY_VALUE}
                    />
                    <TextInput
                      isLight
                      label="Identité de la personne contrôlée"
                      name={`targetDetails.${index}.operatorName`}
                      plaintext
                      value={reporting.targetDetails[index]?.operatorName || EMPTY_VALUE}
                    />
                  </>
                )}
                {reporting.vehicleType === VehicleTypeEnum.VESSEL && (
                  <>
                    <HistoryOfInfractions
                      isReadOnly
                      mmsi={reporting.targetDetails[index]?.mmsi}
                      reportingId={reporting.id}
                    />

                    <StyledVesselForm>
                      <TextInput
                        isLight
                        label="MMSI"
                        name={`targetDetails.${index}.mmsi`}
                        plaintext
                        value={reporting.targetDetails[index]?.mmsi || EMPTY_VALUE}
                      />
                      <TextInput
                        isLight
                        label="Nom du navire"
                        name={`targetDetails.${index}.vesselName`}
                        plaintext
                        value={reporting.targetDetails[index]?.vesselName || EMPTY_VALUE}
                      />
                    </StyledVesselForm>
                    <StyledVesselForm>
                      <TextInput
                        isLight
                        label="IMO"
                        name={`targetDetails.${index}.imo`}
                        plaintext
                        value={reporting.targetDetails[index]?.imo || EMPTY_VALUE}
                      />
                      <TextInput
                        isLight
                        label="Nom du capitaine"
                        name={`targetDetails.${index}.operatorName`}
                        plaintext
                        value={isSuperUser ? reporting.targetDetails[index]?.operatorName || EMPTY_VALUE : EMPTY_VALUE}
                      />
                    </StyledVesselForm>
                    <StyledVesselForm>
                      <TextInput
                        isLight
                        label="Immatriculation"
                        name={`targetDetails.${index}.externalReferenceNumber`}
                        plaintext
                        value={reporting.targetDetails[index]?.externalReferenceNumber || EMPTY_VALUE}
                      />
                      <TextInput
                        isLight
                        label="Taille"
                        name={`targetDetails.${index}.size`}
                        plaintext
                        value={
                          reporting.targetDetails[index]?.size
                            ? String(reporting.targetDetails[index]?.size)
                            : EMPTY_VALUE
                        }
                      />
                    </StyledVesselForm>
                  </>
                )}
              </StyledVesselContainer>
              {!isSuperUser && reporting.targetDetails[index]?.operatorName && (
                <Text>Le nom du capitaine peut être communiqué par téléphone par le CACEM</Text>
              )}
            </TargetWrapper>
          ))
        : null}
    </>
  )
}

const StyledTargetDetailsContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  padding: 8px;
  gap: 16px;
`

const TargetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`

const TargetNumber = styled.span`
  font-weight: 700;
`
const StyledVesselContainer = styled(StyledTargetDetailsContainer)`
  flex-direction: column;
  align-self: stretch;
`

const Text = styled.span`
  font-size: 12px;
  font-style: italic;
`
