import { CellActionThemes } from '../CellActionThemes'
import { CellCompletionStatus } from '../CellCompletionStatus'
import { CellEditMission } from '../CellEditMission'
import { CellLocalizeMission } from '../CellLocalizeMission'
import { CellStatus } from '../CellStatus'
import { getDateCell } from '../getDateCell'
import { getMissionTypeCell } from '../getMissionTypeCell'
import { getNumberOfControlsCell } from '../getNumberOfControlsCell'
import { getResourcesCell } from '../getResourcesCell'
import { sortCompletion, sortNumberOfControls, sortStatus } from '../utils'

import type { Row } from '@tanstack/react-table'

export const Columns = [
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    size: 135
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 135
  },
  {
    accessorFn: row => row.facade,
    cell: info => info.getValue(),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 96
  },
  {
    accessorFn: row => row.missionTypes,
    cell: info => getMissionTypeCell(info.getValue()),
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    size: 120
  },
  {
    accessorFn: row => row.controlUnits,
    cell: info => getResourcesCell(info.getValue()),
    enableSorting: false,
    header: () => 'Unité (Administration)',
    id: 'unitAndAdministration',
    size: 256
  },

  {
    accessorFn: row => row.envActions,
    cell: info => <CellActionThemes envActions={info.getValue()} />,
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    size: 392
  },
  {
    accessorFn: row => row.envActions,
    cell: info => getNumberOfControlsCell(info.getValue()),
    header: () => 'Ctr.',
    id: 'envActions',
    size: 66,
    sortingFn: (rowA: Row<any>, rowB: Row<any>, columnId: string) => sortNumberOfControls(rowA, rowB, columnId)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => <CellStatus row={row} />,
    header: () => 'Statut',
    id: 'status',
    size: 107,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortStatus(rowA, rowB)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => <CellCompletionStatus row={row} />,
    header: () => 'État données',
    id: 'completion',
    size: 127,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortCompletion(rowA, rowB)
  },
  {
    accessorFn: row => row.geom,
    cell: info => <CellLocalizeMission geom={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 52
  },
  {
    accessorFn: row => row.id,
    cell: info => <CellEditMission id={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 52
  }
]
