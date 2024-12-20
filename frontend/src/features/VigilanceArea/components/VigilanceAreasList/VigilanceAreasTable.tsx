import {
  getPaddingValuesForVirtualizeTable,
  PaddingForVirtualizeTable
} from '@components/Table/PaddingForVirtualizeTable'
import { TableContainer } from '@components/Table/style'
import { TableWithSelectableRowsHeader } from '@components/Table/TableWithSelectableRows/Header'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { useTable } from '@hooks/useTable'
import { useTableVirtualizer } from '@hooks/useTableVirtualizer'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type SortingState } from '@tanstack/react-table'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'

import { Columns } from './Columns'

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

  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'name' }])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset, false).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset, isFetching),
    [isLoading, isFetching, legacyFirefoxOffset]
  )

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : vigilanceAreas), [isLoading, vigilanceAreas])

  const table = useTable({
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

  const [before, after] = getPaddingValuesForVirtualizeTable(virtualRows, rowVirtualizer)

  return (
    <TableContainer ref={tableContainerRef}>
      <TableWithSelectableRows.Table>
        <TableWithSelectableRows.Head>
          {table.getHeaderGroups().map(headerGroup => (
            <TableWithSelectableRowsHeader key={headerGroup.id} headerGroup={headerGroup} />
          ))}
        </TableWithSelectableRows.Head>
        {before > 0 && <PaddingForVirtualizeTable columLength={columns.length} height={before} name="before" />}
        <tbody>
          {virtualRows?.map(virtualRow => {
            const row = rows[virtualRow.index]

            return (
              <TableWithSelectableRows.BodyTr key={virtualRow.key} data-cy="vigilance-area-row">
                {row?.getVisibleCells().map(cell => (
                  <TableWithSelectableRows.Td
                    key={cell.id}
                    $hasRightBorder={cell.column.id === 'geom'}
                    $isCenter={cell.column.id === 'geom' || cell.column.id === 'edit'}
                    style={{
                      maxWidth: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      width: cell.column.getSize()
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableWithSelectableRows.Td>
                ))}
              </TableWithSelectableRows.BodyTr>
            )
          })}
        </tbody>
        {after > 0 && <PaddingForVirtualizeTable columLength={columns.length} height={after} name="after" />}
      </TableWithSelectableRows.Table>
    </TableContainer>
  )
}
