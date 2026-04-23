import { createPinnedCellStyle } from '@components/Table/TableWithSelectableRows/utils'
import { SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'
import styled from 'styled-components'

import type { TagFromAPI } from '../../../../domain/entities/tags'

export function Row({ row }: { row: RowType<TagFromAPI> }) {
  return (
    <>
      <SimpleTable.BodyTr key={row.id} data-cy="tag-row">
        {row?.getVisibleCells().map((cell, index, rowCells) => {
          const cellStyle = createPinnedCellStyle({
            context: cell,
            index,
            rowLength: rowCells.length
          })

          return (
            <ExpandableRowCell
              key={cell.id}
              onClick={() => row.toggleExpanded()}
              style={{
                maxWidth: cell.column.getSize(),
                minWidth: cell.column.getSize(),
                width: cell.column.getSize(),
                ...cellStyle
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ExpandableRowCell>
          )
        })}
      </SimpleTable.BodyTr>
    </>
  )
}

const ExpandableRowCell = styled(SimpleTable.Td)<{
  $isDraft?: boolean
}>`
  cursor: pointer;
  user-select: none;
  color: ${p => (p.$isDraft ? p.theme.color.slateGray : p.theme.color.charcoal)};
  font-style: ${p => (p.$isDraft ? 'italic' : 'normal')};
`
