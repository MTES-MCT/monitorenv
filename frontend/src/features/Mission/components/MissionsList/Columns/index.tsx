import { HumanDateCell } from '@components/Table/Cells/HumanDateCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { ActionsCell } from '@features/Mission/components/MissionsList/Cells/ActionsCell'
import { ThemesCell } from '@features/Mission/components/MissionsList/Cells/ThemesCell'
import { getAllThemes } from '@features/Mission/utils'

import { getControlUnitsAsText } from '../../../../../domain/entities/legacyControlUnit'
import { CompletionStatusCell } from '../Cells/CompletionStatusCell'
import { MissionTypeCell } from '../Cells/MissionTypeCell'
import { NumberOfControlsCell } from '../Cells/NumberOfControlsCell'
import { ResourcesCell } from '../Cells/ResourcesCell'
import { StatusCell } from '../Cells/StatusCell'
import { sortCompletion, sortNumberOfControls, sortStatus, sortThemes } from '../utils'

import type { Row } from '@tanstack/react-table'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching = false) => [
  {
    accessorFn: row => row.id,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span title={info.getValue()}>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'N°',
    id: 'id',
    size: 70 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.startDateTimeUtc,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <HumanDateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDate',
    size: 140 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.endDateTimeUtc,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <HumanDateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDate',
    size: 140 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.facade,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 144 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.missionTypes,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <MissionTypeCell missionTypes={info.getValue()} />),
    enableSorting: true,
    header: () => 'Type',
    id: 'type',
    size: 110 + legacyFirefoxOffset
  },
  {
    accessorFn: row => getControlUnitsAsText(row.controlUnits),
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ResourcesCell controlUnits={info.getValue()} />),
    enableSorting: true,
    header: () => 'Unité',
    id: 'unit',
    minSize: 220 + legacyFirefoxOffset,
    size: 220 + legacyFirefoxOffset
  },
  {
    accessorFn: row => getAllThemes(row.envActions ?? [])[0],
    cell: info =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <ThemesCell asDetails={false} themes={info.getValue() ? [info.getValue()] : []} />
      ),
    enableSorting: true,
    header: () => 'Thématiques',
    id: 'themes',
    minSize: 275 + legacyFirefoxOffset,
    size: 275 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortThemes(rowA, rowB, 'envActions')
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
    size: 126 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortStatus(rowA, rowB)
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CompletionStatusCell row={row} />),
    header: () => 'État données',
    id: 'completion',
    size: 146 + legacyFirefoxOffset,
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
