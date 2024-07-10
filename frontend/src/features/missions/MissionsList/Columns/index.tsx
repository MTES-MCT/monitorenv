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

export const Columns = (legacyFirefoxOffset: number = 0) => [
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    size: 153 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 153 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.facade,
    cell: info => info.getValue(),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 110 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.missionTypes,
    cell: info => getMissionTypeCell(info.getValue()),
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    size: 136 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.controlUnits,
    cell: info => getResourcesCell(info.getValue()),
    enableSorting: false,
    header: () => 'Unité (Administration)',
    id: 'unitAndAdministration',
    size: 300 + legacyFirefoxOffset
  },

  {
    accessorFn: row => row.envActions,
    cell: info => <CellActionThemes envActions={info.getValue()} />,
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    size: 444 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.envActions,
    cell: info => getNumberOfControlsCell(info.getValue()),
    header: () => 'Ctr.',
    id: 'envActions',
    size: 75 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>, columnId: string) => sortNumberOfControls(rowA, rowB, columnId)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => <CellStatus row={row} />,
    header: () => 'Statut',
    id: 'status',
    size: 121 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortStatus(rowA, rowB)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => <CellCompletionStatus row={row} />,
    header: () => 'État données',
    id: 'completion',
    size: 144 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortCompletion(rowA, rowB)
  },
  {
    accessorFn: row => row.geom,
    cell: info => <CellLocalizeMission geom={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 56 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.id,
    cell: info => <CellEditMission id={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 62 + legacyFirefoxOffset
  }
]
