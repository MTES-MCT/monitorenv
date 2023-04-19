import { Accent, Tag } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { IconButton } from 'rsuite'
import styled, { css } from 'styled-components'

import { COLORS } from '../../../../../constants/constants'
import {
  actionTargetTypeLabels,
  ActionTargetTypeEnum,
  FormalNoticeEnum,
  InfractionTypeEnum,
  infractionTypeLabels,
  VehicleTypeEnum,
  vehicleTypeLabels,
  VesselTypeEnum,
  vesselTypeLabels
} from '../../../../../domain/entities/missions'
import { ReactComponent as DeleteSVG } from '../../../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as DuplicateSVG } from '../../../../../uiMonitor/icons/Duplicate.svg'
import { ReactComponent as EditIconSVG } from '../../../../../uiMonitor/icons/Edit.svg'

export function InfractionCard({
  canAddInfraction,
  currentActionIndex,
  currentInfractionIndex,
  duplicateInfraction,
  removeInfraction,
  setCurrentInfractionIndex
}) {
  const infractionPath = `envActions.${currentActionIndex}.infractions.${currentInfractionIndex}`
  const [, meta] = useField(infractionPath)
  const [targetTypeField] = useField(`envActions.${currentActionIndex}.actionTargetType`)
  const [vehicleTypeField] = useField<VehicleTypeEnum>(`envActions.${currentActionIndex}.vehicleType`)
  const [vesselType] = useField<VesselTypeEnum>(`${infractionPath}.vesselType`)
  const [registrationNumber] = useField<string>(`${infractionPath}.registrationNumber`)
  const [controlledPersonIdentity] = useField<string>(`${infractionPath}.controlledPersonIdentity`)
  const [companyName] = useField<string>(`${infractionPath}.companyName`)
  const [infractionType] = useField<InfractionTypeEnum>(`${infractionPath}.infractionType`)
  const [formalNotice] = useField<FormalNoticeEnum>(`${infractionPath}.formalNotice`)
  const [natinf] = useField(`${infractionPath}.natinf`)
  const [isClosedField] = useField<Boolean>(`isClosed`)

  const readOnly = isClosedField.value

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
        {targetTypeField.value === ActionTargetTypeEnum.VEHICLE && (
          <VehicleType>
            {vehicleTypeLabels[vehicleTypeField?.value]?.libelle || 'Non Renseigné'}
            {vehicleTypeField?.value === VehicleTypeEnum.VESSEL
              ? ` – ${vesselTypeLabels[vesselType?.value]?.libelle || 'Type non défini'}`
              : ''}
            &nbsp;&ndash;&nbsp;
          </VehicleType>
        )}
        {targetTypeField.value === ActionTargetTypeEnum.VEHICLE ? (
          <Identification>{registrationNumber?.value || ' sans immatriculation'}</Identification>
        ) : (
          <Identification>
            {companyName?.value ||
              controlledPersonIdentity?.value ||
              actionTargetTypeLabels[targetTypeField.value]?.libelle}
          </Identification>
        )}
        <SummaryDetails>
          <Info accent={Accent.PRIMARY}>{libelleInfractionType}</Info>
          {formalNotice?.value === FormalNoticeEnum.YES && <Info accent={Accent.PRIMARY}>MED</Info>}
          <Info accent={Accent.PRIMARY}>
            {natinf.value?.length || '0'} NATINF {natinf.value?.length && `: ${natinf.value?.join(', ')}`}
          </Info>
        </SummaryDetails>
      </Summary>
      <ButtonsWrapper>
        <IconButton appearance="ghost" icon={<EditIcon className="rs-icon" />} onClick={setCurrentInfractionIndex}>
          {readOnly ? 'Consulter' : 'Editer'}
        </IconButton>
        {!readOnly && (
          <>
            <IconButton
              appearance="ghost"
              data-cy="duplicate-infraction"
              disabled={!canAddInfraction}
              icon={<DuplicateSVG className="rs-icon" />}
              onClick={duplicateInfraction}
              title="dupliquer"
            />
            <IconButton appearance="ghost" icon={<DeleteIcon />} onClick={removeInfraction} />
          </>
        )}
      </ButtonsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $hasError: boolean }>`
  background: ${COLORS.white};
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
  flex: 0 0 162px;
  align-items: center;
  justify-content: space-between;
`

const VehicleType = styled.span`
  font-weight: 500;
  color: ${COLORS.gunMetal};
`

const Identification = styled.span`
  font-weight: 500;
  color: ${COLORS.gunMetal};
`

const SummaryDetails = styled.div`
  margin-top: 9px;
`

const Info = styled(Tag)`
  margin-right: 8px;
`

const EditIcon = styled(EditIconSVG)``

const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`
