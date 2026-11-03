import { ExpandableRowCell } from '@components/Table/TableWithSelectableRows/style'
import { createPinnedCellStyle } from '@components/Table/TableWithSelectableRows/utils'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'
import React, { Fragment } from 'react'
import styled from 'styled-components'

import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

export function BaseRow<T>({
  children,
  customCellStyle,
  'data-cy': dataCy,
  row,
  rowVirtualizer,
  stickyLeftBorderIndex,
  virtualRow
}: {
  children: React.ReactNode
  customCellStyle?: React.CSSProperties
  'data-cy': string
  row: RowType<T>
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  stickyLeftBorderIndex: number
  virtualRow: VirtualItem
}) {
  return (
    <Fragment key={row.id}>
      <StyledTr
        ref={(node: HTMLTableRowElement | null) => {
          rowVirtualizer.measureElement(node)
        }}
        data-cy={dataCy}
        data-index={virtualRow.index}
      >
        {row?.getVisibleCells().map((cell, index) => {
          const cellStyle =
            customCellStyle ??
            createPinnedCellStyle({
              context: cell,
              index,
              stickyLeftBorderIndex
            })

          return (
            <ExpandableRowCell key={cell.id} onClick={() => row.toggleExpanded()} style={cellStyle}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ExpandableRowCell>
          )
        })}
      </StyledTr>
      {children}
    </Fragment>
  )
}

const StyledTr = styled(TableWithSelectableRows.BodyTr)`
  td:nth-of-type(1),
  td:nth-of-type(2),
  td:nth-of-type(3),
  td:nth-of-type(5) {
    text-overflow: unset;
  }
`
