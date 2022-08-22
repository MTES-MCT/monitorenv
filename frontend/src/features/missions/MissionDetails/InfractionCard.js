import React from 'react'
import styled from 'styled-components'
import { useField } from 'formik'
import { IconButton } from 'rsuite'

import { vehicleTypeEnum, formalNoticeEnum, infractionTypeEnum, vesselTypeEnum } from '../../../domain/entities/missions'

import { ReactComponent as EditIconSVG } from '../../../uiMonitor/icons/Bouton_edition.svg'
import { ReactComponent as DeleteSVG } from '../../../uiMonitor/icons/Suppression_clair.svg'

import { COLORS } from '../../../constants/constants'

export const InfractionCard = ({ currentActionIndex, infractionPath,  setCurrentInfractionIndex, removeInfraction }) => {
  const [vehicleTypeField] = useField(`actions.${currentActionIndex}.vehicleType`)
  const [vesselType] = useField(`${infractionPath}.vesselType`)
  const [registrationNumber] = useField(`${infractionPath}.registrationNumber`)
  const [infractionType] = useField(`${infractionPath}.infractionType`)
  const [formalNotice] = useField(`${infractionPath}.formalNotice`)
  const [natinf] = useField(`${infractionPath}.natinf`)

  return (
    <Wrapper>
      <Summary>
        <VehicleType>{vehicleTypeEnum[vehicleTypeField?.value]?.libelle || 'Non Renseigné'} {vesselTypeEnum[vesselType?.value]?.libelle || 'Non Renseigné'}</VehicleType>
        <RegistrationNumber>({registrationNumber?.value || 'sans immatriculation'})</RegistrationNumber>
        <SummaryDetails>
          <Info>
            {infractionTypeEnum[infractionType?.value]?.libelle || 'NR'}
          </Info>
          <Info>
            MED : { formalNoticeEnum[formalNotice?.value]?.libelle || 'NR'}
          </Info>
          <Info>
            {natinf.value?.length || '0'} codes NATINF
          </Info>
        </SummaryDetails>
      </Summary>
      <ButtonsWrapper>
        <IconButton icon={<EditIcon/>} onClick={setCurrentInfractionIndex} />
        <IconButton icon={<DeleteIcon/>} onClick={removeInfraction}></IconButton>
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

const Summary = styled.div``

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`

const VehicleType = styled.div``

const RegistrationNumber = styled.div``

const SummaryDetails = styled.div``

const Info = styled.span`
  margin-right: 20px
`

const EditIcon = styled(EditIconSVG)``

// const Delete = styled(DeleteButton)`
//   margin-left: 16px;
//   width: 14px;
// `
const DeleteIcon = styled(DeleteSVG)`
  color: ${COLORS.maximumRed};
`