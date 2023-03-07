import { Table } from 'rsuite'

import { getDateAsLocalizedStringCompact } from '../../../utils/getDateAsLocalizedString'

type DateCellProps = {
  dataKey?: any
  rowData?: any
}

export function DateCell({ dataKey, rowData, ...cellprops }: DateCellProps) {
  if (!rowData[dataKey]) {
    return <Table.Cell {...cellprops}>Non saisie</Table.Cell>
  }

  return <Table.Cell {...cellprops}>{getDateAsLocalizedStringCompact(rowData[dataKey])}</Table.Cell>
}
