import { StyledChevronIcon } from '@features/commonStyles/icons/ChevronIconButton'
import { Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender } from '@tanstack/react-table'
import { forwardRef } from 'react'

import { getPaddingValuesForVirtualizeTable, PaddingForVirtualizeTable } from './PaddingForVirtualizeTable'
import { TableContainer } from './style'

export function TableWithRef({ className = '', columnsLength, rows, rowVirtualizer, table, virtualRows }, ref) {
  const [before, after] = getPaddingValuesForVirtualizeTable(virtualRows, rowVirtualizer)

  return (
    <TableContainer ref={ref} className={className}>
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
                          asc: <StyledChevronIcon $isOpen />,
                          desc: <StyledChevronIcon $isOpen={false} />
                        }[header.column.getIsSorted() as string] ?? <Icon.SortingArrows size={14} />)}
                    </SimpleTable.SortContainer>
                  )}
                </SimpleTable.Th>
              ))}
            </tr>
          ))}
        </SimpleTable.Head>

        <tbody>
          {before > 0 && <PaddingForVirtualizeTable columLength={columnsLength} height={before} name="before" />}
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
          {after > 0 && <PaddingForVirtualizeTable columLength={columnsLength} height={after} name="after" />}
        </tbody>
      </SimpleTable.Table>
    </TableContainer>
  )
}

export const Table = forwardRef(TableWithRef)
