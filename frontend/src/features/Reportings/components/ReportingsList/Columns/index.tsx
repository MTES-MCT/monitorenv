import { DateCell } from '@components/Table/DateCell'
import { LocalizeCell } from '@components/Table/LocalizeCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { getFormattedReportingId, sortTargetDetails } from '@features/Reportings/utils'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ButtonsGroupRow } from '../Cells/ButtonsRowGroup'
import { CellActionStatus } from '../Cells/CellActionStatus'
import { CellActionTheme } from '../Cells/CellActionThemes'
import { CellAttachedtoMission } from '../Cells/CellAttachedToMission'
import { CellStatus } from '../Cells/CellStatus'
import { CellTarget } from '../Cells/CellTarget'
import { CellValidityTime } from '../Cells/CellValidityTime'
import { getReportType } from '../Cells/getReportType'

import type { Row } from '@tanstack/react-table'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching: boolean = false) => [
  {
    accessorFn: row => row.reportingId,
    cell: ({ row }) => (
      <TableWithSelectableRows.RowCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler(row)}
      />
    ),
    enableSorting: false,
    header: ({ table }) => (
      <TableWithSelectableRows.RowCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),

    id: 'select',
    size: 43 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.reportingId,
    cell: info =>
      isFetching ? <StyledSkeletonRow /> : <Cell id={info.getValue()}>{getFormattedReportingId(info.getValue())}</Cell>,
    enableSorting: false,
    header: () => '',
    id: 'reportingId',
    size: 100 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.createdAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Date (UTC)',
    id: 'createdAt',
    size: 153 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.validityTime,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CellValidityTime row={row} />),
    enableSorting: false, // TODO see how we can sort on timeLeft and not validityTime
    header: () => 'Fin dans',
    id: 'validityTime',
    size: 87 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.reportingSources?.map(source => source.displayedSource).join(', '),
    cell: info =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <Cell id={info.getValue()} title={info.getValue()}>
          {info.getValue()}
        </Cell>
      ),
    enableSorting: true,
    header: () => 'Source',
    id: 'displayedSource',
    size: 208 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.reportType,
    cell: info => (isFetching ? <StyledSkeletonRow /> : getReportType(info.getValue())),
    enableSorting: true,
    header: () => 'Type',
    id: 'reportType',
    size: 150 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.targetDetails,
    cell: ({ row }) =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <CellTarget
          description={row.original.description}
          targetDetails={row.original.targetDetails}
          targetType={row.original.targetType}
          vehicleType={row.original.vehicleType}
        />
      ),
    header: () => 'Cible',
    id: 'targetDetails',
    size: 190 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortTargetDetails(rowA.original, rowB.original)
  },
  {
    accessorFn: row => row.theme,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CellActionTheme theme={row.original.theme} />),
    enableSorting: true,
    header: () => 'Thématique',
    id: 'theme',
    size: 265 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => rowA.original.theme?.name?.localeCompare(rowB.original.theme?.name)
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <Cell id={info.getValue()}>{info.getValue()}</Cell>),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 104 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.status,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CellStatus row={row} />),
    enableSorting: true,
    header: () => 'Statut',
    id: 'isArchived',
    size: 104 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>, columnId: string) => {
      if (rowA.original[columnId] > rowB.original[columnId]) {
        return -1
      }
      if (rowB.original[columnId] > rowA.original[columnId]) {
        return 1
      }

      return 1
    }
  },
  {
    accessorFn: row => row.missionId,
    cell: ({ row }) =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <CellAttachedtoMission
          detachedFromMissionAtUtc={row.original.detachedFromMissionAtUtc}
          missionId={row.original.missionId}
        />
      ),
    enableSorting: false,
    header: () => '',
    id: 'missionId',
    size: 106 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.geom,
    cell: ({ row }) =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <CellActionStatus
          controlStatus={row.original.controlStatus}
          detachedFromMissionAtUtc={row.original.detachedFromMissionAtUtc}
          isControlRequired={row.original.isControlRequired}
          missionId={row.original.missionId}
        />
      ),
    enableSorting: false,
    header: () => '',
    id: 'actionStatus',
    size: 102 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.geom,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <LocalizeCell geom={info.getValue()} />),
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 65 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.id,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ButtonsGroupRow id={info.getValue()} />),
    enableSorting: false,
    header: () => '',
    id: 'id',
    size: 110 + legacyFirefoxOffset
  }
]

const Cell = styled.span``
