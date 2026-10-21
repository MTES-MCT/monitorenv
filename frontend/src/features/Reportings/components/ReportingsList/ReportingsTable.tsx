import { SelectableRowsTable } from '@components/Table/TableWithSelectableRows'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { useTable } from '@hooks/useTable'
import { useTableVirtualizer } from '@hooks/useTableVirtualizer'
import { type RowSelectionState, type SortingState } from '@tanstack/react-table'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'

import { Columns } from './Columns'
import { GroupActions } from './GroupActions'
import { Row } from './Row'

import type { Row as RowType } from '@tanstack/table-core/build/lib/types'
import type { Reporting } from 'domain/entities/reporting'

export function ReportingsTable({
  isFetching,
  isLoading,
  reportings
}: {
  isFetching: boolean
  isLoading: boolean
  reportings: Reporting[] | undefined
}) {
  const { pathname } = useLocation()

  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -35 : 0

  // TODO add highlight ?
  // const openReportings = useAppSelector(state => state.reporting.reportings)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'createdAt' }])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset, false).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset, isFetching),
    [isLoading, isFetching, legacyFirefoxOffset]
  )

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : reportings), [isLoading, reportings])

  const table = useTable({
    columnPinning: {
      right: ['actions']
    },
    columns,
    data: tableData,
    rowSelection,
    setRowSelection,
    setSorting,
    sorting,
    withRowSelection: true
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowVirtualizer = useTableVirtualizer({ estimateSize: 45, ref: tableContainerRef, rows })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const selectedIds = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => Number(original.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, rowSelection]
  )

  const resetSelection = () => {
    table.resetRowSelection(true)
  }

  return (
    <>
      <GroupActions
        archiveOrDeleteReportingsCallback={resetSelection}
        reportingsIds={selectedIds}
        totalReportings={reportings?.length || 0}
      />
      <StyledSelectableRowsTable
        ref={tableContainerRef}
        className="reportings-table"
        columnsLength={columns.length}
        rows={
          <>
            {virtualRows?.map(virtualRow => {
              const row = rows[virtualRow.index] as RowType<Reporting>

              return <Row key={virtualRow.key} row={row} rowVirtualizer={rowVirtualizer} virtualRow={virtualRow} />
            })}
          </>
        }
        rowVirtualizer={rowVirtualizer}
        stickyLeftBorderIndex={3}
        table={table}
        virtualRows={virtualRows}
      />
    </>
  )
}

const StyledSelectableRowsTable = styled(SelectableRowsTable)`
  .rs-checkbox-checker {
    padding: 9px 16px;
  }
`
