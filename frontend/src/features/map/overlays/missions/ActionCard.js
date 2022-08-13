import React from 'react'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

import { actionTargetTypeEnum } from '../../../../domain/entities/missions'

import { COLORS } from '../../../../constants/constants'

export const ActionCard = ({feature, }) => {
  const { 
    // actionType, 
    actionNumberOfControls, 
    actionTargetType,
    // actionTheme, 
    actionStartDatetimeUtc, 
    infractions
  } = feature.getProperties()
  const parsedactionStartDatetimeUtc = new Date(actionStartDatetimeUtc)

  

  return (
  <ActionCardHeader>
    <Col1>
      <ActionDate>
        {isValid(parsedactionStartDatetimeUtc) && format(parsedactionStartDatetimeUtc, "dd MMM yyyy", {locale: fr})}
      </ActionDate>
    </Col1>
    <Col2>
      <ControlSummary>
        <Accented>{actionNumberOfControls || 0}</Accented>
        {` contrôles réalisés sur des cibles de type ` }
        <Accented>{actionTargetTypeEnum[actionTargetType]?.libelle || 'non spécifié'}</Accented>
      </ControlSummary>
      <Tags>
        <Tag>RAS</Tag>
        <Tag>INFRA</Tag>
        <Tag>INFRA SANS PV</Tag>
        <Tag>MED</Tag>
      </Tags>
      <Accented>{infractions || 0}</Accented>infraction(s)
    </Col2>
  </ActionCardHeader>
  )
}

const ActionCardHeader = styled.div`
  background: ${COLORS.white};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  display: flex;
  width: 265px;
  z-index: ${props=> props.selected ? 4900 : 5000}
`

const ActionDate = styled.div`
  width: 75px;
  font-size: 12px;
  margin-right: 16px;
`

const Accented = styled.span`
  font-weight: bold;
`

const ControlSummary = styled.div`
  font: normal normal normal 13px/18px Marianne;
  color: ${COLORS.slateGray};
`

const Col1 = styled.div`
  padding: 8px 0px 5px 10px;
`
const Col2 = styled.div`
  padding: 8px 8px 4px 8px;
`

const Tags = styled.div`
  display: flex;
  margin-top: 16px;
  margin-bottom: 16px;
`

const Tag = styled.div`
  background: ${COLORS.missingGrey};
  border-radius: 11px;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  padding: 2px 8px 2px 8px;
  :not(:first-child) {
    margin-left: 8px;
  }
`