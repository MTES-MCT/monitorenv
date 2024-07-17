import { Accent, Button, Icon, IconButton, Tag } from '@mtes-mct/monitor-ui'
import {
  type EnvActionControl,
  FormalNoticeEnum,
  type Infraction,
  InfractionTypeEnum,
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
  const [, meta] = useField<Infraction>(infractionPath)
  const [targetTypeField] = useField<EnvActionControl['actionTargetType']>(
    `envActions.${envActionIndex}.actionTargetType`
  )
  const [vehicleTypeField] = useField<VehicleTypeEnum>(`envActions.${envActionIndex}.vehicleType`)
  const [mmsi] = useField<Infraction['mmsi']>(`${infractionPath}.mmsi`)
  const [imo] = useField<Infraction['imo']>(`${infractionPath}.imo`)
  const [registrationNumber] = useField<Infraction['registrationNumber']>(`${infractionPath}.registrationNumber`)
  const [companyName] = useField<Infraction['companyName']>(`${infractionPath}.companyName`)
  const [vesselName] = useField<Infraction['vesselName']>(`${infractionPath}.vesselName`)
  const [vesselSize] = useField<Infraction['vesselSize']>(`${infractionPath}.vesselSize`)

  const [controlledPersonIdentity] = useField<Infraction['controlledPersonIdentity']>(
    `${infractionPath}.controlledPersonIdentity`
  )
  const [infractionType] = useField<InfractionTypeEnum>(`${infractionPath}.infractionType`)
  const [formalNotice] = useField<FormalNoticeEnum>(`${infractionPath}.formalNotice`)
  const [natinf] = useField<Infraction['natinf']>(`${infractionPath}.natinf`)
  const [nbTarget] = useField<Infraction['nbTarget']>(`${infractionPath}.nbTarget`)

  const displayIdentification = () => {
    const defaultIdentification = () => {
      if (!targetTypeField.value) {
        return 'Cible non renseignée'
      }
      const targetType = TargetTypeLabels[targetTypeField.value].toLowerCase()
      if (nbTarget.value > 1) {
        return `${nbTarget.value}
          ${targetType
            .split(' ')
            .map((word: string) => `${word}s`)
            .join(' ')}`
      }

      return `${nbTarget.value} ${targetType}`
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
      addToIdentification(registrationNumber.value)
    }

    const addVesselIdentification = () => {
      addToIdentification(vesselName.value)

      if (mmsi.value) {
        identification.push(mmsi.value)
      } else if (imo.value) {
        identification.push(imo.value)
      } else if (registrationNumber.value) {
        identification.push(registrationNumber.value)
      } else if (controlledPersonIdentity.value) {
        identification.push(controlledPersonIdentity.value)
      } else {
        addDefaultVehicleIdentification()
      }
      addToIdentification(vesselSize.value)
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
            break
        }
        break

      case TargetTypeEnum.COMPANY:
        addToIdentification(companyName.value)
        addToIdentification(controlledPersonIdentity.value)
        break

      case TargetTypeEnum.INDIVIDUAL:
        addToIdentification(controlledPersonIdentity.value)
        break

      default:
        break
    }

    return identification.join(' - ')
  }

  let libelleInfractionType
  switch (infractionType?.value) {
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
          {formalNotice?.value === FormalNoticeEnum.YES && <Info accent={Accent.PRIMARY}>MED</Info>}
          <Info accent={Accent.PRIMARY}>
            {natinf.value?.length ?? '0'} NATINF {natinf.value?.length && `: ${natinf.value?.join(', ')}`}
          </Info>
        </SummaryDetails>
      </Summary>
      <ButtonsWrapper>
        <Button accent={Accent.SECONDARY} Icon={Icon.Edit} onClick={setCurrentInfractionIndex}>
          Editer
        </Button>

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
