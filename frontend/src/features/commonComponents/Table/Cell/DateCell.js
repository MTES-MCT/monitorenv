import React from 'react'
import { Table } from 'rsuite'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const DateCell = ({dataKey, rowData, ...cellprops}) => {
  
  if (!rowData[dataKey]) {
    return <Table.Cell  {...cellprops}>Non saisie</Table.Cell>
  }

  const date = new Date(rowData[dataKey])

  return <Table.Cell  {...cellprops}>
      {date === 'Invalid Date' ? 'Erreur de date' : format(date, "dd MMM yy, HH'h'mm", {locale: fr})}
    </Table.Cell>
}
