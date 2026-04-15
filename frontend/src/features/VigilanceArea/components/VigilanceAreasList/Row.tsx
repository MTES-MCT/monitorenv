import {
  ExpandableRowCell,
  ExpandedRow,
  ExpandedRowCell,
  ExpandedRowLabel,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { createPinnedCellStyle } from '@components/Table/TableWithSelectableRows/utils'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'

import { FrequencyCell } from './Cells/FrequencyCell'
import { TagsDetailsCell } from './Cells/TagsDetailsCell'
import { ThemesDetailsCell } from './Cells/ThemesDetailsCell'
import { ValidationDateDetailsCell } from './Cells/ValidationDateDetailsCell'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export function Row({ row }: { row: RowType<VigilanceArea.VigilanceArea> }) {
  const vigilanceArea: VigilanceArea.VigilanceArea = row.original

  return (
    <>
      <TableWithSelectableRows.BodyTr key={row.id} data-cy="vigilance-area-row">
        {row?.getVisibleCells().map((cell, index, rowCells) => {
          const cellStyle = createPinnedCellStyle({
            context: cell,
            index,
            rowLength: rowCells.length
          })

          return (
            <ExpandableRowCell
              key={cell.id}
              $isDraft={vigilanceArea.isDraft}
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
      </TableWithSelectableRows.BodyTr>
      {row.getIsExpanded() && (
        <ExpandedRow $isDraft={vigilanceArea.isDraft} data-id={`${row.id}-expanded`}>
          <ExpandedRowCell>
            <ExpandedRowLabel>Commentaire</ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.comments}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <FrequencyCell periods={vigilanceArea.periods} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Thématiques et sous-thématiques</ExpandedRowLabel>
            <ThemesDetailsCell themes={vigilanceArea.themes} />
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowLabel>Tags et sous-tags</ExpandedRowLabel>
            <TagsDetailsCell tags={vigilanceArea.tags} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Dernière validation</ExpandedRowLabel>
            <ValidationDateDetailsCell date={vigilanceArea.validatedAt} />
            <ExpandedRowLabel>Dernière modification</ExpandedRowLabel>
            <ValidationDateDetailsCell date={vigilanceArea.updatedAt} />
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={4}>
            <ExpandedRowLabel>Créée par </ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.createdBy}</ExpandedRowValue>
          </ExpandedRowCell>
        </ExpandedRow>
      )}
    </>
  )
}
