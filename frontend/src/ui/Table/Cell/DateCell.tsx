import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Table } from 'rsuite'

type DateCellProps = {
  dataKey?: any
  rowData?: any
}

export function DateCell({ dataKey, rowData, ...cellprops }: DateCellProps) {
  if (!rowData[dataKey]) {
    return <Table.Cell {...cellprops}>Non saisie</Table.Cell>
  }

  const date = new Date(rowData[dataKey])

  return (
    <Table.Cell {...cellprops}>
      {isValid(rowData[dataKey]) ? 'Erreur de date' : format(date, "dd MMM yy, HH'h'mm", { locale: fr })}
    </Table.Cell>
  )
}
