import { DateCell } from '@components/Table/DateCell'
import { LocalizeCell } from '@components/Table/LocalizeCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'

import { CellActionThemes } from '../Cells/CellActionThemes'
import { CellCompletionStatus } from '../Cells/CellCompletionStatus'
import { CellEditMission } from '../Cells/CellEditMission'
import { CellStatus } from '../Cells/CellStatus'
import { getMissionTypeCell } from '../Cells/getMissionTypeCell'
import { getNumberOfControlsCell } from '../Cells/getNumberOfControlsCell'
import { getResourcesCell } from '../Cells/getResourcesCell'
import { sortCompletion, sortNumberOfControls, sortStatus } from '../utils'

import type { Row } from '@tanstack/react-table'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching = false) => [
  {
    accessorFn: row => row.id,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'N°',
    id: 'id',
    size: 66 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    size: 134 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 134 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.facade,
    cell: info => (isFetching ? <StyledSkeletonRow /> : info.getValue()),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 106 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.missionTypes,
    cell: info => (isFetching ? <StyledSkeletonRow /> : getMissionTypeCell(info.getValue())),
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    size: 106 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.controlUnits,
    cell: info => (isFetching ? <StyledSkeletonRow /> : getResourcesCell(info.getValue())),
    enableSorting: false,
    header: () => 'Unité (Administration)',
    id: 'unitAndAdministration',
    size: 312 + legacyFirefoxOffset
  },

  {
    accessorFn: row => row.envActions,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <CellActionThemes envActions={info.getValue()} />),
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    size: 482 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.envActions,
    cell: info => (isFetching ? <StyledSkeletonRow /> : getNumberOfControlsCell(info.getValue())),
    header: () => 'Ctr.',
    id: 'envActions',
    size: 66 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>, columnId: string) => sortNumberOfControls(rowA, rowB, columnId)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CellStatus row={row} />),
    header: () => 'Statut',
    id: 'status',
    size: 107 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortStatus(rowA, rowB)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CellCompletionStatus row={row} />),
    header: () => 'État données',
    id: 'completion',
    size: 127 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortCompletion(rowA, rowB)
  },
  {
    accessorFn: row => row.geom,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <LocalizeCell geom={info.getValue()} />),
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 52 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.id,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <CellEditMission id={info.getValue()} />),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 52 + legacyFirefoxOffset
  }
]
