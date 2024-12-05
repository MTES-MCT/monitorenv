import { Accent, Icon, IconButton, Tag } from '@mtes-mct/monitor-ui'
import {
  type EnvActionControl,
  FormalNoticeEnum,
  type Infraction,
  InfractionSeizureEnum,
  infractionTypeLabels
} from 'domain/entities/missions'
import { TargetTypeEnum, TargetTypeLabels } from 'domain/entities/targetType'
import { VehicleTypeEnum, vehicleTypeLabels } from 'domain/entities/vehicleType'
import { useField } from 'formik'
import styled, { css } from 'styled-components'

import { StyledDeleteIconButton } from '../style'

export function InfractionCard({
  canAddInfraction,
  currentInfractionIndex,
  duplicateInfraction,
  envActionIndex,
  removeInfraction,
  setCurrentInfractionIndex
}) {
  const infractionPath = `envActions.${envActionIndex}.infractions.${currentInfractionIndex}`
  const [infraction, meta] = useField<Infraction>(infractionPath)
  const {
    companyName,
    controlledPersonIdentity,
    formalNotice,
    imo,
    infractionType,
    mmsi,
    natinf,
    nbTarget,
    registrationNumber,
    seizure,
    vesselName,
    vesselSize
  } = infraction.value

  const [targetTypeField] = useField<EnvActionControl['actionTargetType']>(
    `envActions.${envActionIndex}.actionTargetType`
  )
  const [vehicleTypeField] = useField<VehicleTypeEnum>(`envActions.${envActionIndex}.vehicleType`)

  const displayIdentification = () => {
    const defaultIdentification = () => {
      if (!targetTypeField.value) {
        return 'Cible non renseignée'
      }
      const targetType = TargetTypeLabels[targetTypeField.value].toLowerCase()
      if (nbTarget > 1) {
        return `${nbTarget}
          ${targetType
            .split(' ')
            .map((word: string) => `${word}s`)
            .join(' ')}`
      }

      return `${nbTarget} ${targetType}`
    }
    const identification: string[] = [defaultIdentification()]

    const addToIdentification = (identity: string | Number | null | undefined) => {
      if (identity) {
        identification.push(String(identity))
      }
    }

    const addDefaultVehicleIdentification = () => {
      identification.push(vehicleTypeLabels[vehicleTypeField.value].label)
    }

    const addVehicleIdentification = () => {
      addToIdentification(registrationNumber)
    }

    const addVesselIdentification = () => {
      addToIdentification(vesselName)

      if (mmsi) {
        identification.push(mmsi)
      } else if (imo) {
        identification.push(imo)
      } else if (registrationNumber) {
        identification.push(registrationNumber)
      } else if (controlledPersonIdentity) {
        identification.push(controlledPersonIdentity)
      } else {
        addDefaultVehicleIdentification()
      }
      addToIdentification(vesselSize)
    }

    switch (targetTypeField.value) {
      case TargetTypeEnum.VEHICLE:
        switch (vehicleTypeField.value) {
          case VehicleTypeEnum.OTHER_SEA:
          case VehicleTypeEnum.VEHICLE_AIR:
          case VehicleTypeEnum.VEHICLE_LAND:
            addVehicleIdentification()
            break
          case VehicleTypeEnum.VESSEL:
            addVesselIdentification()
            break
          default:
            addToIdentification('Type non renseigné')
            break
        }
        break

      case TargetTypeEnum.COMPANY:
        addToIdentification(companyName)
        addToIdentification(controlledPersonIdentity)
        break

      case TargetTypeEnum.INDIVIDUAL:
        addToIdentification(controlledPersonIdentity)
        break

      default:
        break
    }

    return identification.join(' - ')
  }

  let libelleInfractionType
  switch (infractionType) {
    case undefined:
      libelleInfractionType = 'PV : -'
      break
    case infractionTypeLabels.WITHOUT_REPORT.code:
      libelleInfractionType = infractionTypeLabels.WITHOUT_REPORT.libelle
      break
    case infractionTypeLabels.WITH_REPORT.code:
      libelleInfractionType = infractionTypeLabels.WITH_REPORT.libelle
      break
    case infractionTypeLabels.WAITING.code:
    default:
      libelleInfractionType = infractionTypeLabels.WAITING.libelle
  }

  return (
    <Wrapper $hasError={!!meta.error}>
      <Summary>
        <Identification data-cy={`infraction-${currentInfractionIndex}-identification`}>
          {displayIdentification()}
        </Identification>
        <SummaryDetails>
          <Info accent={Accent.PRIMARY}>{libelleInfractionType}</Info>
          {formalNotice === FormalNoticeEnum.YES && <Info accent={Accent.PRIMARY}>MED</Info>}
          <Info accent={Accent.PRIMARY}>
            {natinf?.length ?? '0'} NATINF {natinf?.length && `: ${natinf?.join(', ')}`}
          </Info>
          {seizure === InfractionSeizureEnum.YES && <Info accent={Accent.PRIMARY}>1 APPR./SAISIE</Info>}
        </SummaryDetails>
      </Summary>
      <ButtonsWrapper>
        <IconButton accent={Accent.SECONDARY} Icon={Icon.Edit} onClick={setCurrentInfractionIndex} title="Editer" />

        <>
          <IconButton
            accent={Accent.SECONDARY}
            data-cy="duplicate-infraction"
            disabled={!canAddInfraction}
            Icon={Icon.Duplicate}
            onClick={duplicateInfraction}
            title="dupliquer"
          />
          <StyledDeleteIconButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={removeInfraction} />
        </>
      </ButtonsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $hasError: boolean }>`
  background: ${p => p.theme.color.white};
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  ${p =>
    p.$hasError &&
    css`
      border: 2px solid ${p.theme.color.maximumRed};
    `}
`

const Summary = styled.div`
  height: 48px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`

const Identification = styled.span`
  font-weight: 500;
  color: ${p => p.theme.color.gunMetal};
`

const SummaryDetails = styled.div`
  margin-top: 9px;
`

const Info = styled(Tag)`
  margin-right: 8px;
`
