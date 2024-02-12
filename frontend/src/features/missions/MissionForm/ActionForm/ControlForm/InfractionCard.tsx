import { Accent, Button, Icon, IconButton, Tag } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import styled, { css } from 'styled-components'

import {
  FormalNoticeEnum,
  InfractionTypeEnum,
  infractionTypeLabels,
  VesselTypeEnum,
  vesselTypeLabels,
  type EnvActionControl,
  type Infraction
} from '../../../../../domain/entities/missions'
import { TargetTypeEnum, TargetTypeLabels } from '../../../../../domain/entities/targetType'
import { vehicleTypeLabels, VehicleTypeEnum } from '../../../../../domain/entities/vehicleType'
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
  const [vesselType] = useField<VesselTypeEnum>(`${infractionPath}.vesselType`)
  const [registrationNumber] = useField<Infraction['registrationNumber']>(`${infractionPath}.registrationNumber`)
  const [controlledPersonIdentity] = useField<Infraction['controlledPersonIdentity']>(
    `${infractionPath}.controlledPersonIdentity`
  )
  const [companyName] = useField<Infraction['companyName']>(`${infractionPath}.companyName`)
  const [infractionType] = useField<InfractionTypeEnum>(`${infractionPath}.infractionType`)
  const [formalNotice] = useField<FormalNoticeEnum>(`${infractionPath}.formalNotice`)
  const [natinf] = useField<Infraction['natinf']>(`${infractionPath}.natinf`)

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
        {targetTypeField.value === TargetTypeEnum.VEHICLE && (
          <VehicleType>
            {/* TODO Fix the type here: `label` is a `string` but can be undefined? */}
            {vehicleTypeLabels[vehicleTypeField?.value]?.label ?? 'Non Renseigné'}
            {vehicleTypeField?.value === VehicleTypeEnum.VESSEL
              ? // TODO Fix the type here: `libelle` is a `string` but can be undefined?
                ` – ${vesselTypeLabels[vesselType?.value]?.libelle ?? 'Type non défini'}`
              : ''}
            &nbsp;&ndash;&nbsp;
          </VehicleType>
        )}
        {targetTypeField.value === TargetTypeEnum.VEHICLE ? (
          <Identification>{registrationNumber?.value ?? ' sans immatriculation'}</Identification>
        ) : (
          <Identification>
            {companyName?.value ?? controlledPersonIdentity?.value ?? TargetTypeLabels[targetTypeField.value]}
          </Identification>
        )}
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

const VehicleType = styled.span`
  font-weight: 500;
  color: ${p => p.theme.color.gunMetal};
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
