import { ChevronIcon } from '@features/commonStyles/icons/ChevronIcon.style'
import { Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender } from '@tanstack/react-table'
import { notUndefined } from '@tanstack/react-virtual'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { TableContainer } from './style'

export function TableWithRef({ columnsLength, rows, rowVirtualizer, table, virtualRows }, ref) {
  const [before, after] =
    virtualRows.length > 0
      ? [
          notUndefined(virtualRows[0]).start - rowVirtualizer.options.scrollMargin,
          rowVirtualizer.getTotalSize() - notUndefined(virtualRows[virtualRows.length - 1]).end
        ]
      : [0, 0]

  return (
    <TableContainer ref={ref}>
      <SimpleTable.Table>
        <SimpleTable.Head>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <SimpleTable.Th key={header.id} $width={header.getSize()}>
                  {header.isPlaceholder ? undefined : (
                    <SimpleTable.SortContainer
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
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
        {before > 0 && (
          <tr>
            <td aria-label="padding before" colSpan={columnsLength} style={{ height: before }} />
          </tr>
        )}
        <tbody>
          {virtualRows?.map(virtualRow => {
            const row = rows[virtualRow?.index]

            return (
              <SimpleTable.BodyTr
                key={row?.id}
                ref={rowVirtualizer.measureElement} // measure dynamic row height
                data-index={virtualRow.index} // needed for dynamic row height measurement
              >
                {row?.getVisibleCells().map(cell => (
                  <SimpleTable.Td
                    key={cell.id}
                    $isCenter={cell.column.id === 'geom' || cell.column.id === 'edit'}
                    style={{
                      maxWidth: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      width: cell.column.getSize()
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </SimpleTable.Td>
                ))}
              </SimpleTable.BodyTr>
            )
          })}
        </tbody>
        {after > 0 && (
          <tr>
            <td aria-label="padding after" colSpan={columnsLength} style={{ height: after }} />
          </tr>
        )}
      </SimpleTable.Table>
    </TableContainer>
  )
}

export const Table = forwardRef(TableWithRef)

const StyledChevronIcon = styled(ChevronIcon)`
  margin-top: 0px;
  margin-right: 0px;
`
