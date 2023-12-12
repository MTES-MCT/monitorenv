import { CellActionThemes } from '../CellActionThemes'
import { CellEditMission } from '../CellEditMission'
import { CellLocalizeMission } from '../CellLocalizeMission'
import { CellStatus } from '../CellStatus'
import { getDateCell } from '../getDateCell'
import { getMissionSourceCell } from '../getMissionSourceCell'
import { getMissionTypeCell } from '../getMissionTypeCell'
import { getNumberOfControlsCell } from '../getNumberOfControlsCell'
import { getResourcesCell } from '../getResourcesCell'

import type { ControlPlansSubTheme, ControlPlansTheme } from '../../../../domain/entities/controlPlan'

export const Columns = (
  themes?: Array<ControlPlansTheme> | undefined,
  subThemes?: Array<ControlPlansSubTheme> | undefined
) => [
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    size: 180
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 180
  },
  {
    accessorFn: row => row.missionSource,
    cell: info => getMissionSourceCell(info.getValue()),
    enableSorting: true,
    header: () => 'Origine',
    id: 'missionSource',
    size: 90
  },
  {
    accessorFn: row => row.controlUnits,
    cell: info => getResourcesCell(info.getValue()),
    enableSorting: false,
    header: () => 'Unité (Administration)',
    id: 'unitAndAdministration',
    maxSize: 280,
    minSize: 230
  },
  {
    accessorFn: row => row.missionTypes,
    cell: info => getMissionTypeCell(info.getValue()),
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    size: 90
  },
  {
    accessorFn: row => row.facade,
    cell: info => info.getValue(),
    enableSorting: true,
    header: () => 'Facade',
    id: 'seaFront',
    size: 100
  },
  {
    accessorFn: row => row.envActions,
    cell: info => <CellActionThemes envActions={info.getValue()} subThemes={subThemes || []} themes={themes || []} />,
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    maxSize: 280,
    minSize: 100,
    size: 230
  },
  {
    accessorFn: row => row.envActions,
    cell: info => getNumberOfControlsCell(info.getValue()),
    enableSorting: false,
    header: () => 'Nbre contrôles',
    id: 'controls',
    size: 110
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
    size: 100
  }
]
