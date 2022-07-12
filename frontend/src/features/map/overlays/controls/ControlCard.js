import React from 'react'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

import { COLORS } from '../../../../constants/constants'
import { missionTypeEnum } from '../../../../domain/entities/missions'

export const ControlCard = ({feature}) => {
  const { 
    actionStartDatetimeUtc,
    missionType,
    unit,
    administration,
    numberOfActions,
    missionStatus,
  } = feature.getProperties()
  const parsedActionStartDatetimeUtc = new Date(actionStartDatetimeUtc)


  return (<>
  <ControlCardHeader>
    <Col1>
      <ControlDate>
        {isValid(parsedActionStartDatetimeUtc) && format(parsedActionStartDatetimeUtc, "dd MMM yyyy", {locale: fr})}
      </ControlDate>
    </Col1>
    <Col2>
      <ControlType>Control {missionTypeEnum[missionType]?.libelle}</ControlType>
      <ControlReources>{administration} ({unit})</ControlReources>
      <Actions>{numberOfActions} actions réalisées</Actions>
      <ControlStatus>{missionStatus}</ControlStatus>
    </Col2>
  </ControlCardHeader>
  </>)
}

const ControlCardHeader = styled.div`
background: ${COLORS.white};
padding: 4px 5px 5px 5px;
border-top-left-radius: 2px;
border-top-right-radius: 2px;
display: flex;
`

const ControlDate = styled.div`
`

const ControlType = styled.div`
font-weight: bold;
`

const ControlReources = styled.div`
`
const Actions = styled.div`
`
const ControlStatus = styled.div`
`

const Col1 = styled.div``
const Col2 = styled.div``