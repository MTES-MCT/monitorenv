import { Columns } from '@features/Vessel/components/VesselResume/constants'
import { useTableVirtualizer } from '@hooks/useTableVirtualizer'
import { Icon, MapMenuDialog, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { notUndefined } from '@tanstack/react-virtual'
import { useMemo, useRef } from 'react'
import styled from 'styled-components'

import type { Vessel } from '@features/Vessel/types'

type PositionsProps = {
  positions: Vessel.Position[]
}

export function PositionsTable({ positions }: PositionsProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const columns = useMemo(() => Columns(false), [])

  const isBodyEmptyDataVisible = !positions.length

  const table = useReactTable({
    columns,
    data: positions,
    enableSortingRemoval: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id.toString(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          desc: true,
          id: 'timestamp'
        }
      ]
    },
    rowCount: positions?.length ?? 0
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useTableVirtualizer({ estimateSize: 42, overscan: 50, ref: tableContainerRef, rows })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const [paddingBeforeRows, paddingAfterRows] =
    virtualRows.length > 0
      ? [
          notUndefined(virtualRows[0]).start - rowVirtualizer.options.scrollMargin,
          rowVirtualizer.getTotalSize() - notUndefined(virtualRows[virtualRows.length - 1]).end
        ]
      : [0, 0]

  return (
    <Wrapper ref={tableContainerRef}>
      <MapMenuDialog.Header>
        <MapMenuDialog.Title>Liste des positions AIS affichées</MapMenuDialog.Title>
      </MapMenuDialog.Header>
      <Body>
        <SimpleTable.Table>
          <SimpleTable.Head>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <SimpleTable.Th key={header.id} $width={header.column.getSize()}>
                    {!header.isPlaceholder && (
                      <SimpleTable.SortContainer
                        className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() &&
                          ({
                            asc: <Icon.SortSelectedDown size={14} />,
                            desc: <Icon.SortSelectedUp size={14} />
                          }[header.column.getIsSorted() as string] ?? <Icon.SortingArrows size={14} />)}
                      </SimpleTable.SortContainer>
                    )}
                  </SimpleTable.Th>
                ))}
              </tr>
            ))}
          </SimpleTable.Head>

          {!isBodyEmptyDataVisible && (
            <tbody>
              {paddingBeforeRows > 0 && (
                <tr>
                  <td aria-label="padding before" colSpan={columns.length} style={{ height: paddingBeforeRows }} />
                </tr>
              )}
              {virtualRows.map(virtualRow => {
                const row = rows[virtualRow?.index]

                return (
                  <SimpleTable.BodyTr
                    key={virtualRow.key}
                    ref={node => rowVirtualizer?.measureElement(node)}
                    data-id={row?.id}
                    data-index={virtualRow?.index}
                  >
                    {row?.getVisibleCells().map(cell => (
                      <SimpleTable.Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </SimpleTable.Td>
                    ))}
                  </SimpleTable.BodyTr>
                )
              })}
              {paddingAfterRows > 0 && (
                <tr>
                  <td aria-label="padding after" colSpan={columns.length} style={{ height: paddingAfterRows }} />
                </tr>
              )}
            </tbody>
          )}
        </SimpleTable.Table>
      </Body>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  max-height: 500px;
  overflow: auto;
  text-align: center;
`

const Body = styled(MapMenuDialog.Body)`
  padding: 0;
`
