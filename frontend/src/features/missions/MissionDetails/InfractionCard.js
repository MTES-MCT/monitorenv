import React from 'react'
import styled from 'styled-components'
import { useField } from 'formik'
import { IconButton } from 'rsuite'

import { vehicleTypeEnum, formalNoticeEnum, infractionTypeEnum, vesselTypeEnum, actionTargetTypeEnum } from '../../../domain/entities/missions'

import { ReactComponent as EditIconSVG } from '../../../uiMonitor/icons/Bouton_edition.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'

import { COLORS } from '../../../constants/constants'

export const InfractionCard = ({ currentActionIndex, infractionPath,  setCurrentInfractionIndex, removeInfraction }) => {
  const [targetTypeField] = useField(`envActions.${currentActionIndex}.actionTargetType`)
  const [vehicleTypeField] = useField(`envActions.${currentActionIndex}.vehicleType`)
  const [vesselType] = useField(`${infractionPath}.vesselType`)
  const [registrationNumber] = useField(`${infractionPath}.registrationNumber`)
  const [controlledPersonIdentity] = useField(`${infractionPath}.controlledPersonIdentity`)
  const [companyName] = useField(`${infractionPath}.companyName`)
  const [infractionType] = useField(`${infractionPath}.infractionType`)
  const [formalNotice] = useField(`${infractionPath}.formalNotice`)
  const [natinf] = useField(`${infractionPath}.natinf`)

  return (
    <Wrapper>
      <Summary>
        {targetTypeField.value == actionTargetTypeEnum.VEHICLE.code && 
          <VehicleType>
            {vehicleTypeEnum[vehicleTypeField?.value]?.libelle 
            || 'Non Renseigné'} {vehicleTypeField?.value ===  vehicleTypeEnum.VESSEL.code ? 
            ` – ${vesselTypeEnum[vesselType?.value]?.libelle}` 
            : '' }
             &ndash; 
          </VehicleType>
        }
        {targetTypeField.value == actionTargetTypeEnum.VEHICLE.code ?
          <Identification>{registrationNumber?.value || 'sans immatriculation'}</Identification>
          : <Identification>{companyName?.value || controlledPersonIdentity?.value || actionTargetTypeEnum[targetTypeField.value]?.libelle }</Identification>
        }
        <SummaryDetails>
          <Info>
            {
            infractionType?.value === undefined ? 'PV : -' : infractionType.value ? 
              infractionTypeEnum.WITHOUT_REPORT.libelle 
              : infractionTypeEnum.WITH_REPORT.libelle
            }
          </Info>
          <Info>
            MED : { formalNoticeEnum[formalNotice?.value]?.libelle || '-'}
          </Info>
          <Info>
            {natinf.value?.length || '0'} NATINF
          </Info>
        </SummaryDetails>
      </Summary>
      <ButtonsWrapper>
        <IconButton appearance='ghost' icon={<EditIcon className='rs-icon' />} onClick={setCurrentInfractionIndex} >Editer</IconButton>
        <IconButton appearance='ghost' icon={<DeleteIcon/>} onClick={removeInfraction}></IconButton>
      </ButtonsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${COLORS.white};
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 12px;
  display:flex;
  justify-content: space-between;
`

const Summary = styled.div`
  height: 40px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  flex: 0 0 142px;
  align-items: center;
  justify-content: space-between;
`

const VehicleType = styled.span`
  font-weight: 800;
  `
  
const Identification = styled.span`
  font-weight: 800;
`

const SummaryDetails = styled.div``

const Info = styled.span`
  margin-right: 24px
`

const EditIcon = styled(EditIconSVG)``

const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`
