import React from 'react'
import { Table } from 'rsuite'
import styled from 'styled-components'
import { COLORS } from '../../../constants/constants'


export const CellStatus = ({rowData, dataKey, ...props}) => {
  return <Table.Cell {...props}>
    {rowData.inputEndDatetimeUtc ? <Closed>Terminé</Closed> : <Open>En cours</Open>}
  </Table.Cell>
}

const Open = styled.div`
  color:${COLORS.missingGreen}
`

const Closed = styled.div`
  color: ${COLORS.missingBlue}
`