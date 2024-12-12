import { ChevronIcon } from '@features/commonStyles/icons/ChevronIcon.style'
import { Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender } from '@tanstack/react-table'
import { forwardRef } from 'react'
import styled from 'styled-components'

export function TableWithRef({ rows, table, virtualRows }, ref) {
  return (
    <StyledDashboardsContainer ref={ref}>
      <SimpleTable.Table>
        <SimpleTable.Head>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <SimpleTable.Th key={header.id} $width={header.column.getSize()}>
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
        <tbody>
          {virtualRows?.map(virtualRow => {
            const row = rows[virtualRow?.index]

            return (
              <SimpleTable.BodyTr key={virtualRow.key}>
                {row?.getVisibleCells().map(cell => (
                  <SimpleTable.Td
                    key={cell.id}
                    $isCenter={cell.column.id === 'geom' || cell.column.id === 'edit'}
                    style={{
                      maxWidth: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      padding: cell.column.id === 'geom' || cell.column.id === 'edit' ? '0px' : '10px 12px',
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
      </SimpleTable.Table>
    </StyledDashboardsContainer>
  )
}

export const Table = forwardRef(TableWithRef)

const StyledDashboardsContainer = styled.div`
  overflow: auto;
  width: fit-content;
  // scroll width (~15px) + 4px
  padding-right: 19px;
`
const StyledChevronIcon = styled(ChevronIcon)`
  margin-top: 0px;
  margin-right: 0px;
`
