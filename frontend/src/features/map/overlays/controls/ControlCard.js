import React from 'react'
import styled from 'styled-components'
import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

import { COLORS } from '../../../../constants/constants'

export const ControlCard = ({feature}) => {
  const { 
    actionStartDatetimeUtc,
    actionTheme,
    actionNumberOfControls,
  } = feature.getProperties()
  const parsedActionStartDatetimeUtc = new Date(actionStartDatetimeUtc)


  return (<>
  <ControlCardHeader>
    <Col1>
      <ControlDate>
        {isValid(parsedActionStartDatetimeUtc) && format(parsedActionStartDatetimeUtc, "dd MMM yyyy à HH:mm", {locale: fr})}
      </ControlDate>
    </Col1>
    <Col2>
      <Theme>{actionTheme}</Theme>
      <Actions>{actionNumberOfControls} contrôles réalisés</Actions>
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

const Theme = styled.div`
`
const Actions = styled.div`
`

const Col1 = styled.div`
  width: 220px;
`
const Col2 = styled.div`
  width: 120px;
`