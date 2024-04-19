import { CellActionThemes } from '../CellActionThemes'
import { CellCompletionStatus } from '../CellCompletionStatus'
import { CellEditMission } from '../CellEditMission'
import { CellLocalizeMission } from '../CellLocalizeMission'
import { CellStatus } from '../CellStatus'
import { getDateCell } from '../getDateCell'
import { getMissionTypeCell } from '../getMissionTypeCell'
import { getNumberOfControlsCell } from '../getNumberOfControlsCell'
import { getResourcesCell } from '../getResourcesCell'

export const Columns = [
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    maxSize: 109,
    minSize: 109,
    size: 109 // +24(padding) + 1(border) = 134
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    maxSize: 109,
    minSize: 109,
    size: 109 // +24(padding) + 1(border) = 134
  },
  {
    accessorFn: row => row.facade,
    cell: info => info.getValue(),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    maxSize: 71,
    minSize: 71,
    size: 71 // +24(padding) + 1(border) = 96
  },
  {
    accessorFn: row => row.missionTypes,
    cell: info => getMissionTypeCell(info.getValue()),
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    maxSize: 95,
    minSize: 95,
    size: 95 // +24(padding) + 1(border) = 120
  },
  {
    accessorFn: row => row.controlUnits,
    cell: info => getResourcesCell(info.getValue()),
    enableSorting: false,
    header: () => 'Unité (Administration)',
    id: 'unitAndAdministration',
    maxSize: 231,
    minSize: 231,
    size: 231 // +24(padding) + 1(border) = 256
  },

  {
    accessorFn: row => row.envActions,
    cell: info => <CellActionThemes envActions={info.getValue()} />,
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    maxSize: 367,
    minSize: 367,
    size: 367 // +24(padding) + 1(border) = 392
  },
  {
    accessorFn: row => row.envActions,
    cell: info => getNumberOfControlsCell(info.getValue()),
    enableSorting: false,
    header: () => 'Ctr.',
    id: 'controls',
    maxSize: 41,
    minSize: 41,
    size: 41 // +24(padding) + 1(border) = 66
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => <CellStatus row={row} />,
    enableSorting: false,
    header: () => 'Statut',
    id: 'status',
    maxSize: 82,
    minSize: 82,
    size: 82 // +24(padding) + 1(border) = 107
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => <CellCompletionStatus row={row} />,
    enableSorting: false,
    header: () => 'État données',
    id: 'completion',
    maxSize: 102,
    minSize: 102,
    size: 102 // +24(padding) + 1(border) = 127
  },
  {
    accessorFn: row => row.geom,
    cell: info => <CellLocalizeMission geom={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    maxSize: 28,
    minSize: 28,
    size: 28
  },
  {
    accessorFn: row => row.id,
    cell: info => <CellEditMission id={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    maxSize: 34,
    minSize: 34,
    size: 34
  }
]
