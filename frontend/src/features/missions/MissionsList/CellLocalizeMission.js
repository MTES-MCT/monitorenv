import React from 'react'
import { Table } from 'rsuite'
import styled from 'styled-components'

import { ReactComponent as LocalizeIconSVG } from '../../icons/Icone_voir_sur_la_carte.svg'

export const CellLocalizeMission = ({rowData, dataKey, ...props}) => {
  return <Table.Cell {...props}>
    <LocalizeIcon />
  </Table.Cell>
}

const LocalizeIcon = styled(LocalizeIconSVG)`
`