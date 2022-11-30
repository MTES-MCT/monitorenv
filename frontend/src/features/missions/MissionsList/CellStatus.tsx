/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

import { getMissionStatus } from '../../../domain/entities/missions'
import { MissionStatusLabel } from '../../../ui/MissionStatusLabel'

export function CellStatus({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  const status = getMissionStatus(rowData)

  return (
    <Table.Cell {...props}>
      <MissionStatusLabel missionStatus={status} />
    </Table.Cell>
  )
}
