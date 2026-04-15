import { TableWithSelectableRowsHeader } from '@components/Table/TableWithSelectableRows/Header'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { type Table as TableType } from '@tanstack/react-table'
import { forwardRef, type ReactNode } from 'react'
import styled from 'styled-components'

import { getPaddingValuesForVirtualizeTable, PaddingForVirtualizeTable } from '../PaddingForVirtualizeTable'
import { TableContainer } from '../style'

import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

type TableProps = {
  className?: string
  columnsLength: number
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  rows: ReactNode | ReactNode[]
  table: TableType<any>
  virtualRows: VirtualItem[]
}

export function SelectableRowsTableWithRef(
  { className = '', columnsLength, rows, rowVirtualizer, table, virtualRows }: TableProps,
  ref
) {
  const [before, after] = getPaddingValuesForVirtualizeTable(virtualRows, rowVirtualizer)

  return (
    <StyledTableContainer ref={ref} className={className}>
      <TableWithSelectableRows.Table>
        <TableWithSelectableRows.Head>
          {table.getHeaderGroups().map(headerGroup => (
            <TableWithSelectableRowsHeader key={headerGroup.id} headerGroup={headerGroup} />
          ))}
        </TableWithSelectableRows.Head>
        {before > 0 && <PaddingForVirtualizeTable columLength={columnsLength} height={before} name="before" />}
        <tbody>{rows}</tbody>
        {after > 0 && <PaddingForVirtualizeTable columLength={columnsLength} height={after} name="after" />}
      </TableWithSelectableRows.Table>
    </StyledTableContainer>
  )
}

export const SelectableRowsTable = forwardRef(SelectableRowsTableWithRef)

const StyledTableContainer = styled(TableContainer)`
  padding-right: 0;
  width: 100%;
`
