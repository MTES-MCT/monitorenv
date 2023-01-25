/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash'
import { Table } from 'rsuite'

import { getControlUnitsAsText, MissionType } from '../../../domain/entities/missions'

type CellResourcesProps = {
  dataKey?: any
  rowData?: MissionType
}
export function CellResources({ dataKey, rowData, ...props }: CellResourcesProps) {
  return <Table.Cell {...props}>{rowData?.controlUnits && getControlUnitsAsText(rowData.controlUnits)}</Table.Cell>
}
