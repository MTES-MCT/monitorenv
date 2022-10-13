import { format, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import React from 'react'
import { Table } from 'rsuite'

export function DateCell({ dataKey, rowData, ...cellprops }) {
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
