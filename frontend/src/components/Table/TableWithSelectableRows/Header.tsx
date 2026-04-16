import { Icon, TableWithSelectableRows, THEME } from '@mtes-mct/monitor-ui'
import { flexRender, type HeaderGroup } from '@tanstack/react-table'

import { createPinnedCellStyle } from './utils'

export function TableWithSelectableRowsHeader({
  headerGroup,
  stickyLeftBorderIndex
}: {
  headerGroup: HeaderGroup<any>
  stickyLeftBorderIndex?: number
}) {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header, index, headerCells) => {
        const cellStyle = createPinnedCellStyle({
          context: header,
          index,
          rowLength: headerCells.length,
          stickyLeftBorderIndex
        })

        return (
          <TableWithSelectableRows.Th key={header.id} $width={header.column.getSize()} style={cellStyle}>
            {header.id === 'select' && flexRender(header.column.columnDef.header, header.getContext())}
            {header.id !== 'select' && !header.isPlaceholder && (
              <TableWithSelectableRows.SortContainer
                className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}

                {header.column.getCanSort() &&
                  ({
                    asc: <Icon.SortingChevrons secondaryColor={THEME.color.lightGray} size={14} />,
                    desc: <Icon.SortingChevrons size={14} tertiaryColor={THEME.color.lightGray} />
                  }[header.column.getIsSorted() as string] ?? <Icon.SortingChevrons size={14} />)}
              </TableWithSelectableRows.SortContainer>
            )}
          </TableWithSelectableRows.Th>
        )
      })}
    </tr>
  )
}
