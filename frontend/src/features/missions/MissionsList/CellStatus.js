import React from 'react'
import { Table } from 'rsuite'

import { MissionStatusLabel } from '../../../ui/MissionStatusLabel'


export const CellStatus = ({rowData, dataKey, ...props}) => {
  return (
  <Table.Cell {...props} >
    <MissionStatusLabel missionStatus={rowData.missionStatus} />
  </Table.Cell>
  )
}
