import { customDayjs } from '@mtes-mct/monitor-ui'
import React from 'react'
import styled from 'styled-components'

import { PanelSubPart } from '../style'

export function PanelDates({
  children,
  createdAt,
  updatedAt
}: {
  children?: React.ReactNode
  createdAt?: string
  updatedAt?: string
}) {
  if (!createdAt && !updatedAt && !children) {
    return null
  }

  return (
    <PanelSubPart>
      <StyledDates>
        {createdAt && `Créée le ${customDayjs(createdAt).utc().format('DD/MM/YY')}. `}
        {updatedAt && `Dernière modification le ${customDayjs(updatedAt).utc().format('DD/MM/YY')}.`}
      </StyledDates>
      {children}
    </PanelSubPart>
  )
}

const StyledDates = styled.p`
  font-style: italic;
  color: ${p => p.theme.color.slateGray};
`
