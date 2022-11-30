/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

import { missionTypeEnum } from '../../../domain/entities/missions'

export function CellMissionType({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  return <Table.Cell {...props}>{missionTypeEnum[rowData.missionType]?.libelle}</Table.Cell>
}
