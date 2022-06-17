import React from 'react'
import { Table } from 'rsuite'
import { missionTypeEnum } from '../../../domain/entities/missions'

export const CellMissionType = ({rowData, dataKey, ...props}) => {
  return <Table.Cell {...props}>
    {missionTypeEnum[rowData.missionType]?.libelle}
  </Table.Cell>
}
