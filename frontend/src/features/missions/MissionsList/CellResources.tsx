/* eslint-disable react/jsx-props-no-spreading */
import { Table } from 'rsuite'

type CellResourcesProps = {
  dataKey?: any
  rowData?: any
}
export function CellResources({ dataKey, rowData, ...props }: CellResourcesProps) {
  return (
    <Table.Cell {...props}>
      {rowData.resourceUnits?.map(resourceUnit => `${resourceUnit.unit} (${resourceUnit.administration || '-'})`)}
    </Table.Cell>
  )
}
