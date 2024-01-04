import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { getFormattedReportingId, sortTargetDetails } from '../../utils'
import { ButtonsGroupRow } from '../Cells/ButtonsRowGroup'
import { CellActionStatus } from '../Cells/CellActionStatus'
import { CellActionThemes } from '../Cells/CellActionThemes'
import { CellAttachedtoMission } from '../Cells/CellAttachedToMission'
import { CellLocalizeReporting } from '../Cells/CellLocalizeReporting'
import { CellStatus } from '../Cells/CellStatus'
import { CellTarget } from '../Cells/CellTarget'
import { CellValidityTime } from '../Cells/CellValidityTime'
import { getDateCell } from '../Cells/getDateCell'
import { getReportType } from '../Cells/getReportType'

import type { Row } from '@tanstack/react-table'

export const Columns = [
  {
    accessorFn: row => row.reportingId,
    cell: ({ row }) => (
      <div className="px-1">
        <TableWithSelectableRows.RowCheckbox
          disabled={!row.getCanSelect()}
          isChecked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler(row)}
        />
      </div>
    ),
    enableSorting: false,
    header: ({ table }) => (
      <TableWithSelectableRows.RowCheckbox
        isChecked={table.getIsAllRowsSelected()}
        isIndeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),

    id: 'select',
    size: 50
  },
  {
    accessorFn: row => row.reportingId,
    cell: info => <Cell id={info.getValue()}>{getFormattedReportingId(info.getValue())}</Cell>,
    enableSorting: false,
    header: () => '',
    id: 'reportingId',
    size: 90
  },
  {
    accessorFn: row => row.createdAt,
    cell: info => getDateCell(info.getValue()),
    enableSorting: true,
    header: () => 'Ouverture',
    id: 'createdAt',
    size: 160
  },
  {
    accessorFn: row => row.validityTime,
    cell: ({ row }) => <CellValidityTime row={row} />,
    enableSorting: false, // TODO see how we can sort on timeLeft and not validityTime
    header: () => 'Fin dans',
    id: 'validityTime',
    size: 70
  },
  {
    accessorFn: row => row.displayedSource,
    cell: info => (
      <Cell id={info.getValue()} title={info.getValue()}>
        {info.getValue()}
      </Cell>
    ),
    enableSorting: true,
    header: () => 'Source',
    id: 'displayedSource',
    maxSize: 210,
    minSize: 190
  },
  {
    accessorFn: row => row.reportType,
    cell: info => getReportType(info.getValue()),
    enableSorting: true,
    header: () => 'Type',
    id: 'reportType',
    size: 140
  },
  {
    accessorFn: row => row.targetDetails,
    cell: ({ row }) => (
      <CellTarget
        targetDetails={row.original.targetDetails}
        targetType={row.original.targetType}
        vehicleType={row.original.vehicleType}
      />
    ),
    header: () => 'Cible',
    id: 'targetDetails',
    maxSize: 190,
    minSize: 160,
    size: 160,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => sortTargetDetails(rowA.original, rowB.original)
  },
  {
    accessorFn: row => row.targetDetails,
    cell: ({ row }) => <CellTarget targetDetails={row.original.targetDetails} targetType={row.original.targetType} />,
    header: () => 'Cible',
    id: 'targetDetails',
    maxSize: 190,
    minSize: 100
  },
  {
    accessorFn: row => row.theme,
    cell: ({ row }) => <CellActionThemes subThemeIds={row.original.subThemeIds} themeId={row.original.themeId} />,
    enableSorting: true,
    header: () => 'Thématique',
    id: 'theme',
    maxSize: 260,
    minSize: 210,
    size: 210
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => <Cell id={info.getValue()}>{info.getValue()}</Cell>,
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 100
  },
  {
    accessorFn: row => row.status,
    cell: ({ row }) => <CellStatus row={row} />,
    enableSorting: true,
    header: () => 'Statut',
    id: 'isArchived',
    size: 90,
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
    cell: ({ row }) => (
      <CellAttachedtoMission
        detachedFromMissionAtUtc={row.original.detachedFromMissionAtUtc}
        missionId={row.original.missionId}
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'missionId',
    size: 110
  },
  {
    accessorFn: row => row.geom,
    cell: ({ row }) => (
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
    size: 110
  },
  {
    accessorFn: row => row.geom,
    cell: info => <CellLocalizeReporting geom={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 55
  },
  {
    accessorFn: row => row.id,
    cell: info => <ButtonsGroupRow id={info.getValue()} />,
    enableSorting: false,
    header: () => '',
    id: 'id',
    maxSize: 100,
    minSize: 100,
    size: 100
  }
]

const Cell = styled.span``
