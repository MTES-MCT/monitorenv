/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

import { getControlUnitsAsText } from '../../../domain/entities/controlUnit'

import type { Mission } from '../../../domain/entities/missions'

type CellResourcesProps = {
  dataKey?: any
  rowData?: Mission
}
export function CellResources({ dataKey, rowData, ...props }: CellResourcesProps) {
  return <Table.Cell {...props}>{rowData?.controlUnits && getControlUnitsAsText(rowData.controlUnits)}</Table.Cell>
}
