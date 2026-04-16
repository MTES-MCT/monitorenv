import { SelectableRowsTable } from '@components/Table/TableWithSelectableRows'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { useTable } from '@hooks/useTable'
import { useTableVirtualizer } from '@hooks/useTableVirtualizer'
import { type Row as RowType, type SortingState } from '@tanstack/react-table'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'

import { Columns } from './Columns'
import { Row } from './Row'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function VigilanceAreasTable({
  isFetching,
  isLoading,
  vigilanceAreas
}: {
  isFetching: boolean
  isLoading: boolean
  vigilanceAreas: VigilanceArea.VigilanceArea[]
}) {
  const { pathname } = useLocation()

  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -35 : 0

  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset, false).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset, isFetching),
    [isLoading, isFetching, legacyFirefoxOffset]
  )

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : vigilanceAreas), [isLoading, vigilanceAreas])

  const table = useTable({
    columnPinning: {
      left: ['name'],
      right: ['actions']
    },
    columns,
    data: tableData,
    setSorting,
    sorting,
    withRowSelection: false
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowVirtualizer = useTableVirtualizer({ estimateSize: 30, ref: tableContainerRef, rows })

  const virtualRows = rowVirtualizer.getVirtualItems()

  return (
    <SelectableRowsTable
      ref={tableContainerRef}
      className="vigilance-area-table"
      columnsLength={columns.length}
      rows={
        <>
          {virtualRows?.map(virtualRow => {
            const row = rows[virtualRow.index] as RowType<VigilanceArea.VigilanceArea>

            return <Row key={virtualRow.key} row={row} />
          })}
        </>
      }
      rowVirtualizer={rowVirtualizer}
      stickyLeftBorderIndex={0}
      table={table}
      virtualRows={virtualRows}
    />
  )
}
