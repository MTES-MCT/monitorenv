import { Icon, TableWithSelectableRows, THEME } from '@mtes-mct/monitor-ui'
import { flexRender, type HeaderGroup } from '@tanstack/react-table'
import styled from 'styled-components'

import { createPinnedCellStyle } from './utils'

export function TableWithSelectableRowsHeader({ headerGroup }: { headerGroup: HeaderGroup<any> }) {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header, index, headerCells) => {
        const cellStyle = createPinnedCellStyle({
          context: header,
          index,
          rowLength: headerCells.length
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
                    asc: (
                      <ChevronWrapper>
                        <StyledChevronIcon $isOpen color={THEME.color.lightGray} size={14} />
                        <StyledChevronIcon color={THEME.color.slateGray} size={14} />
                      </ChevronWrapper>
                    ),
                    desc: (
                      <ChevronWrapper>
                        <StyledChevronIcon $isOpen color={THEME.color.slateGray} size={14} />
                        <StyledChevronIcon color={THEME.color.lightGray} size={14} />
                      </ChevronWrapper>
                    )
                  }[header.column.getIsSorted() as string] ?? (
                    <ChevronWrapper>
                      <StyledChevronIcon $isOpen color={THEME.color.lightGray} size={14} />
                      <StyledChevronIcon color={THEME.color.lightGray} size={14} />
                    </ChevronWrapper>
                  ))}
              </TableWithSelectableRows.SortContainer>
            )}
          </TableWithSelectableRows.Th>
        )
      })}
    </tr>
  )
}

const StyledChevronIcon = styled(Icon.Chevron)<{ $isOpen?: boolean }>`
  transform: ${props => (!props.$isOpen ? 'rotate(0deg)' : 'rotate(-180deg)')};
  transition: all 0.5s;
  width: 12px !important;
  height: 12px !important;
`
const ChevronWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
