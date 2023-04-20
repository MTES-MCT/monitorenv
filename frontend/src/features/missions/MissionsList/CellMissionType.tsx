/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

import { Mission, missionTypeEnum } from '../../../domain/entities/missions'

export function CellMissionType({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: Mission }) {
  const missionTypesAsText = rowData?.missionTypes?.map(t => missionTypeEnum[t]?.libelle).join(' / ')

  return (
    <Table.Cell {...props} title={missionTypesAsText}>
      {missionTypesAsText}
    </Table.Cell>
  )
}
