/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

export function CellAlert({ dataKey, rowData, ...props }: { dataKey?: any; rowData?: any }) {
  return <Table.Cell {...props}> </Table.Cell>
}
