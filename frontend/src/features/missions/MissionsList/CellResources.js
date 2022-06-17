import React from 'react'
import { Table } from 'rsuite'

export const CellResources = ({rowData, dataKey, ...props}) => {
  return <Table.Cell {...props}>
    {`${rowData.unit} (${rowData.administration || '-'})`}
  </Table.Cell>
}
