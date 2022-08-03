import React from 'react'
import _ from 'lodash'
import { Table } from 'rsuite'

export const CellNumberOfControls = ({rowData, dataKey, ...props}) => {
  const numberOfControls = _.reduce(rowData.envActions, (sum, action)=> {
    return sum + (action.actionNumberOfControls || 0)
  }, 0)
  return <Table.Cell {...props}>
    {numberOfControls}
  </Table.Cell>
}
