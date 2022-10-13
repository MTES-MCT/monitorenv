import React from 'react'
import { Table } from 'rsuite'

export function CellResources({ dataKey, rowData, ...props }) {
  return (
    <Table.Cell {...props}>
      {rowData.resourceUnits?.map(resourceUnit => `${resourceUnit.unit} (${resourceUnit.administration || '-'})`)}
    </Table.Cell>
  )
}
