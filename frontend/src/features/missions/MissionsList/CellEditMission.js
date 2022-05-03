import React from 'react'
import { Table } from 'rsuite'
import { EditButton } from '../../commonStyles/Buttons.style'

export const CellEditMission = ({rowData, dataKey, ...props}) => {
  return <Table.Cell {...props}>
    <EditButton />
  </Table.Cell>
}