import React from 'react'
import styled from 'styled-components'
import {  useField } from 'formik';


import { COLORS } from '../../../constants/constants'
import { EditButton, DeleteButton } from '../../commonStyles/Buttons.style'

export const InfractionCard = ({ infractionPath,  setCurrentInfractionIndex, removeInfraction }) => {
  console.log(infractionPath)

  const [vehicle] = useField(`${infractionPath}.vehicle`)
  const [registrationNumber] = useField(`${infractionPath}.registrationNumber`)
  const [infractionType] = useField(`${infractionPath}.infractionType`)
  const [formalNotice] = useField(`${infractionPath}.formalNotice`)


  return (
    <Wrapper>
      <Summary>
        <VehicleType>{vehicle?.value}</VehicleType>
        <RegistrationNumber>({registrationNumber?.value})</RegistrationNumber>
        <SummaryDetails>
          <Info>
            {infractionType?.value || 'NR'}
          </Info>
          <Info>
            MED : {formalNotice?.value || 'NR'}
          </Info>
          <Info>
            3 codes NATINF
          </Info>
        </SummaryDetails>
      </Summary>
      <ButtonsWrapper>
        <EditButton onClick={setCurrentInfractionIndex} />
        <Delete onClick={removeInfraction}></Delete>
      </ButtonsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${COLORS.white};
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
const Delete = styled(DeleteButton)`
  margin-left: 16px;
  width: 14px;
`