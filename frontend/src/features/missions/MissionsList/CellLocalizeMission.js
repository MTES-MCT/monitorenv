import React from 'react'
import { Table } from 'rsuite'
import styled from 'styled-components'

import { ReactComponent as LocalizeIconSVG } from '../../icons/Oeil_apercu_carte.svg'

export const CellLocalizeMission = ({rowData, dataKey, ...props}) => {
  return <Table.Cell {...props}>
    <LocalizeButton>
      <LocalizeIcon />
    </LocalizeButton>
  </Table.Cell>
}
const LocalizeButton = styled.button``

const LocalizeIcon = styled(LocalizeIconSVG)`
  width: 20px;
`