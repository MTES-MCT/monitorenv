import styled from 'styled-components'

import { CellEditReporting } from '../CellEditReporting'
import { CellLocalizeReporting } from '../CellLocalizeReporting'
import { CellStatus } from '../CellStatus'
import { CellValidityTime } from '../CellValidityTime'
import { getDateCell } from '../getDateCell'
import { getReportType } from '../getReportType'

export const Columns = [
  {
    accessorFn: row => row.reportingId,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: true,
    header: () => '',
    id: 'reportingId',
    size: 90
  },
  {
    accessorFn: row => row.createdAt,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Ouverture',
    id: 'createdAt',
    size: 150
  },
  {
    accessorFn: row => row.validityTime,
    cell: info => <CellValidityTime validityTime={info.getValue()} />,
    enableSorting: true,
    header: () => 'Validité',
    id: 'validityTime',
    size: 70
  },
  {
    accessorFn: row => row.displayedSource,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: false,
    header: () => 'Source',
    id: 'displayedSource',
    maxSize: 280,
    minSize: 230
  },
  {
    accessorFn: row => row.reportType,
    cell: info => getReportType(info.getValue()),
    enableSorting: false,
    header: () => 'Type',
    id: 'reportType',
    size: 150
  },
  {
    accessorFn: row => row.theme,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: true,
    header: () => 'Thématique',
    id: 'theme',
    maxSize: 280,
    minSize: 230
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: false,
    header: () => 'Façade',
    id: 'seaFront',
    maxSize: 280,
    minSize: 100,
    size: 230
  },
  {
    accessorFn: row => row.status,
    cell: ({ row }) => <CellStatus row={row} />,
    enableSorting: false,
    header: () => 'Statut',
    id: 'status',
    size: 110
  },
  {
    accessorFn: row => row.geom,
    cell: info => <CellLocalizeReporting geom={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 55
  },
  {
    accessorFn: row => row.id,
    cell: info => <CellEditReporting id={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'id',
    size: 100
  }
]

const Cell = styled.div``
