/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

import { getControlUnitsAsText } from '../../../domain/entities/controlUnit'

import type { Mission } from '../../../domain/entities/missions'

type CellResourcesProps = {
  dataKey?: any
  rowData?: Mission
}
export function CellResources({ dataKey, rowData, ...props }: CellResourcesProps) {
  const controlUnitsAsText = rowData?.controlUnits && getControlUnitsAsText(rowData.controlUnits)

  return (
    <Table.Cell {...props} title={controlUnitsAsText}>
      {controlUnitsAsText}
    </Table.Cell>
  )
}
