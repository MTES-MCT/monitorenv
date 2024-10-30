import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { Icon, TableWithSelectableRows, THEME } from '@mtes-mct/monitor-ui'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'

import { Columns } from './Columns'

export function VigilanceAreasTable({ isLoading, vigilanceAreas }) {
  const { pathname } = useLocation()

  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -35 : 0

  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'name' }])

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : vigilanceAreas), [isLoading, vigilanceAreas])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset),
    [isLoading, legacyFirefoxOffset]
  )

  const table = useReactTable({
    columns,
    data: tableData,
    enableMultiRowSelection: true,
    enableRowSelection: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      sorting
    }
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 40,
    getItemKey: useCallback((index: number) => `${rows[index]?.id}`, [rows]),
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
    paddingEnd: 40,
    paddingStart: 40
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  return (
    <StyledReportingsContainer ref={tableContainerRef}>
      <TableWithSelectableRows.Table>
        <TableWithSelectableRows.Head>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableWithSelectableRows.Th key={header.id} $width={header.column.getSize()}>
                  {!header.isPlaceholder && (
                    <TableWithSelectableRows.SortContainer
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {header.column.getCanSort() &&
                        ({
                          asc: <Icon.SortSelectedUp size={14} />,
                          desc: <Icon.SortSelectedDown size={14} />
                        }[header.column.getIsSorted() as string] ?? (
                          <Icon.SortingChevrons color={THEME.color.lightGray} size={14} />
                        ))}
                    </TableWithSelectableRows.SortContainer>
                  )}
                </TableWithSelectableRows.Th>
              ))}
            </tr>
          ))}
        </TableWithSelectableRows.Head>
        <tbody>
          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index]

            return (
              <TableWithSelectableRows.BodyTr key={virtualRow.key} data-cy="reporting-row">
                {row?.getVisibleCells().map(cell => (
                  <TableWithSelectableRows.Td
                    key={cell.id}
                    $hasRightBorder={!!(cell.column.id === 'geom')}
                    $isCenter={!!(cell.column.id === 'geom' || cell.column.id === 'edit')}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableWithSelectableRows.Td>
                ))}
              </TableWithSelectableRows.BodyTr>
            )
          })}
        </tbody>
      </TableWithSelectableRows.Table>
    </StyledReportingsContainer>
  )
}
const StyledReportingsContainer = styled.div`
  overflow: auto;
  width: fit-content;
  // scroll width (~15px) + 4px
  padding-right: 19px;
`
