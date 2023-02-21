import { Accent, Tag } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../../constants/constants'
import {
  actionTargetTypeEnum,
  formalNoticeEnum,
  infractionTypeEnum,
  vehicleTypeEnum,
  vesselTypeEnum
} from '../../../../../domain/entities/missions'
import { ReactComponent as DeleteSVG } from '../../../../../uiMonitor/icons/Delete.svg'
import { ReactComponent as DuplicateSVG } from '../../../../../uiMonitor/icons/Duplicate.svg'
import { ReactComponent as EditIconSVG } from '../../../../../uiMonitor/icons/Edit.svg'

export function InfractionCard({
  canAddInfraction,
  currentActionIndex,
  duplicateInfraction,
  infractionPath,
  removeInfraction,
  setCurrentInfractionIndex
}) {
  const [targetTypeField] = useField(`envActions.${currentActionIndex}.actionTargetType`)
  const [vehicleTypeField] = useField(`envActions.${currentActionIndex}.vehicleType`)
  const [vesselType] = useField(`${infractionPath}.vesselType`)
  const [registrationNumber] = useField(`${infractionPath}.registrationNumber`)
  const [controlledPersonIdentity] = useField(`${infractionPath}.controlledPersonIdentity`)
  const [companyName] = useField(`${infractionPath}.companyName`)
  const [infractionType] = useField(`${infractionPath}.infractionType`)
  const [formalNotice] = useField(`${infractionPath}.formalNotice`)
  const [natinf] = useField(`${infractionPath}.natinf`)

  let libelleInfractionType
  switch (infractionType?.value) {
    case undefined:
      libelleInfractionType = 'PV : -'
      break
    case infractionTypeEnum.WITHOUT_REPORT.code:
      libelleInfractionType = infractionTypeEnum.WITHOUT_REPORT.libelle
      break
    case infractionTypeEnum.WITH_REPORT.code:
      libelleInfractionType = infractionTypeEnum.WITH_REPORT.libelle
      break
    case infractionTypeEnum.WAITING.code:
    default:
      libelleInfractionType = infractionTypeEnum.WAITING.libelle
  }

  return (
    <Wrapper>
      <Summary>
        {targetTypeField.value === actionTargetTypeEnum.VEHICLE.code && (
          <VehicleType>
            {vehicleTypeEnum[vehicleTypeField?.value]?.libelle || 'Non Renseigné'}
            {vehicleTypeField?.value === vehicleTypeEnum.VESSEL.code
              ? ` – ${vesselTypeEnum[vesselType?.value]?.libelle || 'Type non défini'}`
              : ''}
            &nbsp;&ndash;&nbsp;
          </VehicleType>
        )}
        {targetTypeField.value === actionTargetTypeEnum.VEHICLE.code ? (
          <Identification>{registrationNumber?.value || ' sans immatriculation'}</Identification>
        ) : (
          <Identification>
            {companyName?.value ||
              controlledPersonIdentity?.value ||
              actionTargetTypeEnum[targetTypeField.value]?.libelle}
          </Identification>
        )}
        <SummaryDetails>
          <Info accent={Accent.PRIMARY}>{libelleInfractionType}</Info>
          {formalNotice?.value === formalNoticeEnum.YES.code && <Info accent={Accent.PRIMARY}>MED</Info>}
          <Info accent={Accent.PRIMARY}>
            {natinf.value?.length || '0'} NATINF {natinf.value?.length && `: ${natinf.value?.join(', ')}`}
          </Info>
        </SummaryDetails>
      </Summary>
      <ButtonsWrapper>
        <IconButton appearance="ghost" icon={<EditIcon className="rs-icon" />} onClick={setCurrentInfractionIndex}>
          Editer
        </IconButton>
        <IconButton
          appearance="ghost"
          data-cy="duplicate-infraction"
          disabled={!canAddInfraction}
          icon={<DuplicateSVG className="rs-icon" />}
          onClick={duplicateInfraction}
          title="dupliquer"
        />
        <IconButton appearance="ghost" icon={<DeleteIcon />} onClick={removeInfraction} />
      </ButtonsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${COLORS.white};
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
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
