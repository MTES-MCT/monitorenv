/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash'
import { Table } from 'rsuite'

export function CellNumberOfControls({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  const numberOfControls = _.reduce(rowData.envActions, (sum, action) => sum + (action.actionNumberOfControls || 0), 0)

  return <Table.Cell {...props}>{numberOfControls}</Table.Cell>
}
