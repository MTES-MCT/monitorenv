import { TableWithSelectableRowsHeader } from '@components/Table/TableWithSelectableRows/Header'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { type Table as TableType } from '@tanstack/react-table'
import { forwardRef, type ReactNode } from 'react'
import styled from 'styled-components'

import { getPaddingValuesForVirtualizeTable, PaddingForVirtualizeTable } from '../PaddingForVirtualizeTable'

import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

type TableProps = {
  className?: string
  columnsLength: number
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  rows: ReactNode | ReactNode[]
  stickyLeftBorderIndex?: number
  table: TableType<any>
  virtualRows: VirtualItem[]
}

export function SelectableRowsTableWithRef(
  { className = '', columnsLength, rows, rowVirtualizer, stickyLeftBorderIndex, table, virtualRows }: TableProps,
  ref
) {
  const [before, after] = getPaddingValuesForVirtualizeTable(virtualRows, rowVirtualizer)

  return (
    <StyledTableWrapper ref={ref} className={className}>
      <StyledTableContainer data-cy="scrollable-container">
        <StyledTable>
          <TableWithSelectableRows.Head>
            {table.getHeaderGroups().map(headerGroup => (
              <TableWithSelectableRowsHeader
                key={headerGroup.id}
                headerGroup={headerGroup}
                stickyLeftBorderIndex={stickyLeftBorderIndex}
              />
            ))}
          </TableWithSelectableRows.Head>
          <tbody>
            {before > 0 && <PaddingForVirtualizeTable columLength={columnsLength} height={before} name="before" />}
            {rows}
            {after > 0 && <PaddingForVirtualizeTable columLength={columnsLength} height={after} name="after" />}
          </tbody>
        </StyledTable>
      </StyledTableContainer>
    </StyledTableWrapper>
  )
}

export const SelectableRowsTable = forwardRef(SelectableRowsTableWithRef)

const StyledTableWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`

const StyledTableContainer = styled.div`
  overflow: auto;
  width: 100%;
  height: 100%;
`

const StyledTable = styled(TableWithSelectableRows.Table)`
  width: 100%;
`
