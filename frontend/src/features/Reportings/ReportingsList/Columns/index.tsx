import styled from 'styled-components'

// import { getDateCell } from '../getDateCell'

export const Columns = [
  {
    accessorFn: row => row.id,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: true,
    header: () => '',
    id: 'id',
    size: 180
  },
  {
    accessorFn: row => row.createdAt,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: true,
    header: () => 'Ouverture',
    id: 'createdAt',
    size: 180
  },
  {
    accessorFn: row => row.validityTime,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: true,
    header: () => 'Validité',
    id: 'missionSource',
    size: 90
  },
  {
    accessorFn: row => row.sourceName,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: false,
    header: () => 'Source',
    id: 'unitAndAdministration',
    maxSize: 280,
    minSize: 230
  },
  {
    accessorFn: row => row.sourceType,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    size: 90
  },
  {
    accessorFn: row => row.theme,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: true,
    header: () => 'Thématique',
    id: 'seaFront',
    size: 100
  },
  {
    accessorFn: row => row.envActions,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: false,
    header: () => 'Façade',
    id: 'themes',
    maxSize: 280,
    minSize: 100,
    size: 230
  },
  {
    accessorFn: row => row.envActions,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: false,
    header: () => 'Statut',
    id: 'controls',
    size: 110
  },
  {
    accessorFn: row => row.geom,
    cell: () => <Cell />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 55
  },
  {
    accessorFn: row => row.id,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 100
  }
]

const Cell = styled.div``
