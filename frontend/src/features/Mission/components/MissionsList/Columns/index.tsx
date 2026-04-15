import { DateCell } from '@components/Table/DateCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { ActionsCell } from '@features/Mission/components/MissionsList/Cells/ActionsCell'
import { ActionThemeCell } from '@features/Mission/components/MissionsList/Cells/ActionThemeCell'

import { CompletionStatusCell } from '../Cells/CompletionStatusCell'
import { MissionTypeCell } from '../Cells/MissionTypeCell'
import { NumberOfControlsCell } from '../Cells/NumberOfControlsCell'
import { ResourcesCell } from '../Cells/ResourcesCell'
import { StatusCell } from '../Cells/StatusCell'
import { sortCompletion, sortNumberOfControls, sortStatus } from '../utils'

import type { Row } from '@tanstack/react-table'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching = false) => [
  {
    accessorFn: row => row.id,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'N°',
    id: 'id',
    size: 71 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    size: 130 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 130 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.facade,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 99 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.missionTypes,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <MissionTypeCell missionTypes={info.getValue()} />),
    enableSorting: false,
    header: () => 'Type',
    id: 'type',
    size: 108 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.controlUnits,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ResourcesCell controlUnits={info.getValue()} />),
    enableSorting: false,
    header: () => 'Unité',
    id: 'unit',
    size: 381 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.envActions,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ActionThemeCell envActions={info.getValue()} />),
    enableSorting: false,
    header: () => 'Thématiques',
    id: 'themes',
    size: 381 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.envActions,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <NumberOfControlsCell envActions={info.getValue()} />),
    header: () => 'Contrôles',
    id: 'envActions',
    size: 120 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>, columnId: string) => sortNumberOfControls(rowA, rowB, columnId)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <StatusCell row={row} />),
    header: () => 'Statut',
    id: 'status',
    size: 120 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortStatus(rowA, rowB)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CompletionStatusCell row={row} />),
    header: () => 'État données',
    id: 'completion',
    size: 140 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortCompletion(rowA, rowB)
  },
  {
    accessorFn: row => row.geom,
    cell: ({ row }) =>
      isFetching ? <StyledSkeletonRow /> : <ActionsCell geom={row.original.geom} id={row.original.id} />,
    enableSorting: false,
    header: () => '',
    id: 'actions',
    size: 82 + legacyFirefoxOffset
  }
]
