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
    size: 140
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 140
  },
  {
    accessorFn: row => row.facade,
    cell: info => info.getValue(),
    enableSorting: true,
    header: () => 'Facade',
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
    size: 310
  },

  {
    accessorFn: row => row.envActions,
    cell: info => <CellActionThemes envActions={info.getValue()} />,
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    size: 544
  },
  {
    accessorFn: row => row.envActions,
    cell: info => getNumberOfControlsCell(info.getValue()),
    enableSorting: false,
    header: () => 'Contrôles',
    id: 'controls',
    size: 100
  },
  {
    accessorFn: row => row.isClosed,
    cell: ({ row }) => <CellStatus row={row} />,
    enableSorting: false,
    header: () => 'Statut',
    id: 'status',
    size: 120
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => <CellCompletionStatus row={row} />,
    enableSorting: false,
    header: () => 'État données',
    id: 'completion',
    size: 136
  },
  {
    accessorFn: row => row.geom,
    cell: info => <CellLocalizeMission geom={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 55
  },
  {
    accessorFn: row => row.id,
    cell: info => <CellEditMission id={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 55
  }
]
