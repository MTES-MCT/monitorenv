import { Icon, TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Columns } from './Columns'
import { GroupActions } from './GroupActions'
import { StyledSkeletonRow } from '../../commonComponents/Skeleton'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'

import type { ReportingDetailed } from '../../../domain/entities/reporting'

export function ReportingsTable({
  isLoading,
  reportings
}: {
  isLoading: boolean
  reportings: (ReportingDetailed | undefined)[]
}) {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'createdAt' }])

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : reportings), [isLoading, reportings])

  const columns = useMemo(
    () => (isLoading ? Columns.map(column => ({ ...column, cell: StyledSkeletonRow })) : Columns),
    [isLoading]
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
    overscan: 10
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const [paddingTop, paddingBottom] =
    virtualRows.length > 0
      ? [
          Math.max(0, virtualRows[0]?.start || 0),
          Math.max(0, rowVirtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end || 0))
        ]
      : [0, 0]

  const selectedIds = useMemo(
    () => table.getSelectedRowModel().rows.map(({ original }) => original.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, rowSelection]
  )

  const resetSelection = () => {
    table.resetRowSelection(true)
  }

  return (
    <>
      <GroupActions
        resetSelectionFn={resetSelection}
        selectedReportingsIds={selectedIds}
        totalReportings={reportings?.length || 0}
      />
      <StyledReportingsContainer ref={tableContainerRef}>
        <TableWithSelectableRows.Table>
          <TableWithSelectableRows.Head>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableWithSelectableRows.Th
                    {...{
                      key: header.id,
                      style: {
                        maxWidth: header.column.getSize(),
                        minWidth: header.column.getSize(),
                        width: header.column.getSize()
                      }
                    }}
                  >
                    {header.isPlaceholder ? undefined : (
                      <TableWithSelectableRows.SortContainer
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler()
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getCanSort() &&
                          ({
                            asc: <StyledChevronIcon $isOpen={false} $right={false} />,
                            desc: <StyledChevronIcon $isOpen $right={false} />
                          }[header.column.getIsSorted() as string] ?? <Icon.SortingArrows size={14} />)}
                      </TableWithSelectableRows.SortContainer>
                    )}
                  </TableWithSelectableRows.Th>
                ))}
              </tr>
            ))}
          </TableWithSelectableRows.Head>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index]

              return (
                <StyledTableBodyTr key={virtualRow.key}>
                  {row?.getVisibleCells().map(cell => (
                    <TableWithSelectableRows.Td
                      {...{
                        $isCenter: !!(cell.column.id === 'geom' || cell.column.id === 'edit'),
                        key: cell.id,
                        style: {
                          maxWidth: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                          width: cell.column.getSize()
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableWithSelectableRows.Td>
                  ))}
                </StyledTableBodyTr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </TableWithSelectableRows.Table>
      </StyledReportingsContainer>
    </>
  )
}

const StyledReportingsContainer = styled.div`
  overflow: auto;
`
const StyledChevronIcon = styled(ChevronIcon)`
  margin-top: 0px;
  margin-right: 0px;
`

// TODO to delete when we implement the good table
const StyledTableBodyTr = styled(TableWithSelectableRows.BodyTr)`
  td:nth-child(9) {
    text-align: center;
  }
`
