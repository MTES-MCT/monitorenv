/* eslint-disable react/no-unstable-nested-components */
import { Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Columns } from './Columns'
import { StyledSkeletonRow } from '../../commonComponents/Skeleton'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'

import type { Mission } from '../../../domain/entities/missions'

export function MissionsTable({ isLoading, missions }: { isLoading: boolean; missions: Mission[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'startDate' }])

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : missions), [isLoading, missions])

  const columns = useMemo(
    () => (isLoading ? Columns.map(column => ({ ...column, cell: StyledSkeletonRow })) : Columns),
    [isLoading]
  )

  const table = useReactTable({
    columns,
    data: tableData,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
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

  return (
    <StyledMissionsContainer ref={tableContainerRef}>
      <SimpleTable.Table>
        <SimpleTable.Head>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <SimpleTable.Th
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
                    // TODO pass props as usual: className={}
                    <SimpleTable.SortContainer
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
                    </SimpleTable.SortContainer>
                  )}
                </SimpleTable.Th>
              ))}
            </tr>
          ))}
        </SimpleTable.Head>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index]

            return (
              <SimpleTable.BodyTr key={virtualRow.key}>
                {row?.getVisibleCells().map(cell => (
                  <SimpleTable.Td
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
                  </SimpleTable.Td>
                ))}
              </SimpleTable.BodyTr>
            )
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </SimpleTable.Table>
    </StyledMissionsContainer>
  )
}

const StyledMissionsContainer = styled.div`
  overflow: auto;
`
const StyledChevronIcon = styled(ChevronIcon)`
  margin-top: 0px;
  margin-right: 0px;
`
