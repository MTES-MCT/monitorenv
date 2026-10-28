import {
  ExpandableRowCell,
  ExpandedRow,
  ExpandedRowCell,
  ExpandedRowLabel,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { createPinnedCellStyle, UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { Dashboard } from '@features/Dashboard/types'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'
import { Fragment } from 'react'
import styled from 'styled-components'

import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

export function Row({
  row,
  rowVirtualizer,
  virtualRow
}: {
  row: RowType<Dashboard.Dashboard>
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  virtualRow: VirtualItem
}) {
  const dashboard = row.original
  // const { data: regulatoryAreas } = useGetRegulatoryAreasByIdsQuery(
  //   { axis: Axis.NORTH_SOUTH, ids: dashboard.regulatoryAreaIds },
  //   {
  //     skip: dashboard.regulatoryAreaIds.length === 0
  //   }
  // )
  //
  // const { data: vigilanceAreas } = useGetVigilanceAreasByIdsQuery(
  //   { axis: Axis.NORTH_SOUTH, ids: dashboard.vigilanceAreaIds },
  //   {
  //     skip: dashboard.vigilanceAreaIds.length === 0
  //   }
  // )
  //
  // const allThemes =

  return (
    <Fragment key={row.id}>
      <StyledTr
        ref={(node: HTMLTableRowElement | null) => {
          rowVirtualizer.measureElement(node)
        }}
        data-cy="dashboard-row"
        data-index={virtualRow.index}
      >
        {row?.getVisibleCells().map((cell, index, rowCells) => {
          const cellStyle = createPinnedCellStyle({
            context: cell,
            index,
            rowLength: rowCells.length,
            stickyLeftBorderIndex: 3
          })

          return (
            <ExpandableRowCell key={cell.id} onClick={() => row.toggleExpanded()} style={cellStyle}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ExpandableRowCell>
          )
        })}
      </StyledTr>
      {row.getIsExpanded() && (
        <ExpandedRow data-cy="dashboard-row-expanded">
          <ExpandedRowCell colSpan={4}>
            <ExpandedRowLabel>Commentaires</ExpandedRowLabel>
            <ExpandedRowValue>{dashboard.comments ?? UNKNOWN}</ExpandedRowValue>
          </ExpandedRowCell>
        </ExpandedRow>
      )}
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
