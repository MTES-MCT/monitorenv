import React from 'react'
import { Table } from 'rsuite'

export const CellResources = ({rowData, dataKey, ...props}) => {
  return <Table.Cell {...props}>
    {
      rowData.resourceUnits?.map(resourceUnit => {
        return (
          `${resourceUnit.unit} (${resourceUnit.administration || '-'})`
        )
      })
    }
    
  </Table.Cell>
}
