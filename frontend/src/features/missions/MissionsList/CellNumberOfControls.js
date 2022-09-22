import _ from 'lodash'
import React from 'react'
import { Table } from 'rsuite'

export function CellNumberOfControls({ dataKey, rowData, ...props }) {
  const numberOfControls = _.reduce(rowData.envActions, (sum, action) => sum + (action.actionNumberOfControls || 0), 0)

  return <Table.Cell {...props}>{numberOfControls}</Table.Cell>
}
