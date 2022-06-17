import React from 'react'
import { Table } from 'rsuite'
import { compareAsc } from 'date-fns'
import styled from 'styled-components'
import { COLORS } from '../../../constants/constants'


export const CellStatus = ({rowData, dataKey, ...props}) => {
  const status = compareAsc(rowData.inputStartDatetimeUtc, rowData.inputEndDatetimeUtc)
  return <Table.Cell {...props}>
    {status ? <Open>En cours</Open> : <Closed>Terminé</Closed>}
  </Table.Cell>
}

const Open = styled.div`
  color:${COLORS.red}
`

const Closed = styled.div`
  color: ${COLORS.blue}
`