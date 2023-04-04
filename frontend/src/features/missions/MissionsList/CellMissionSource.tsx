/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

import { MissionType, missionSourceEnum } from '../../../domain/entities/missions'

export function CellMissionSource({ dataKey, rowData, ...props }: { dataKey: string; rowData?: MissionType }) {
  const source = (rowData?.missionSource && missionSourceEnum[rowData?.missionSource]?.label) || ''

  return (
    <Table.Cell title={source} {...props}>
      {source}
    </Table.Cell>
  )
}
