import { DateCell } from '@components/Table/Cells/DateCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { getFormattedReportingId, sortTargetDetails } from '@features/Reportings/utils'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ButtonsGroupRow } from '../Cells/ButtonsRowGroup'
import { CellActionStatus } from '../Cells/CellActionStatus'
import { CellActionTheme } from '../Cells/CellActionThemes'
import { CellAttachedToMission } from '../Cells/CellAttachedToMission'
import { CellTarget } from '../Cells/CellTarget'
import { CellValidityTime } from '../Cells/CellValidityTime'
import { getReportType } from '../Cells/getReportType'

import type { Row } from '@tanstack/react-table'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching: boolean = false) => [
  {
    accessorFn: row => row.reportingId,
    cell: ({ getValue, row }) => (
      <TableWithSelectableRows.RowCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      >
        <HiddenLabel>{`Sélectionner le signalement ${getValue()}`}</HiddenLabel>
      </TableWithSelectableRows.RowCheckbox>
    ),
    enableSorting: false,
    header: ({ table }) => (
      <TableWithSelectableRows.RowCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      >
        <HiddenLabel>Sélectionner tous les signalements</HiddenLabel>
      </TableWithSelectableRows.RowCheckbox>
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
    size: 85 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.createdAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Date (UTC)',
    id: 'createdAt',
    size: 150 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.validityTime,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CellValidityTime row={row} />),
    enableSorting: false,
    header: () => 'Fin dans',
    id: 'validityTime',
    size: 117 + legacyFirefoxOffset
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
    size: 215 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.reportType,
    cell: info => (isFetching ? <StyledSkeletonRow /> : getReportType(info.getValue())),
    enableSorting: true,
    header: () => 'Type',
    id: 'reportType',
    size: 152 + legacyFirefoxOffset
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
    size: 200 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortTargetDetails(rowA.original, rowB.original)
  },
  {
    accessorFn: row => row.theme,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <CellActionTheme theme={row.original.theme} />),
    enableSorting: true,
    header: () => 'Thématique',
    id: 'theme',
    size: 253 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => rowA.original.theme?.name?.localeCompare(rowB.original.theme?.name)
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <Cell id={info.getValue()}>{info.getValue()}</Cell>),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 158 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.missionId,
    cell: ({ row }) =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <TagWrapper>
          <CellAttachedToMission
            detachedFromMissionAtUtc={row.original.detachedFromMissionAtUtc}
            missionId={row.original.missionId}
          />
          <CellActionStatus
            controlStatus={row.original.controlStatus}
            detachedFromMissionAtUtc={row.original.detachedFromMissionAtUtc}
            isControlRequired={row.original.isControlRequired}
            missionId={row.original.missionId}
          />
        </TagWrapper>
      ),
    enableSorting: true,
    header: () => 'Lien mission',
    id: 'missionId',
    size: 250 + legacyFirefoxOffset
  },
  {
    accessorFn: row => ({
      geom: row.geom,
      id: row.id
    }),
    cell: info =>
      isFetching ? <StyledSkeletonRow /> : <ButtonsGroupRow geom={info.getValue().geom} id={info.getValue().id} />,
    enableSorting: false,
    header: () => '',
    id: 'actions',
    size: 142 + legacyFirefoxOffset
  }
]

const Cell = styled.span``
const HiddenLabel = styled.span`
  display: block;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
  overflow: hidden;
`

const TagWrapper = styled.div`
  display: flex;
  gap: 8px;
`
