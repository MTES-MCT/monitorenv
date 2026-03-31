import { createPinnedCellStyle } from '@components/Table/TableWithSelectableRows/utils'
import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender, type Row as RowType } from '@tanstack/react-table'
import styled from 'styled-components'

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
              $isCenter={cell.column.id === 'geom' || cell.column.id === 'edit'}
              $isDraft={!!vigilanceArea.isDraft}
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
        <ExpandedRow $isDraft={!!vigilanceArea.isDraft} data-id={`${row.id}-expanded`}>
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
          <ExpandedRowCell>
            <ExpandedRowLabel>Tags et sous-tags</ExpandedRowLabel>
            <TagsDetailsCell tags={vigilanceArea.tags} />
          </ExpandedRowCell>
          <ExpandedRowCell />
          <ExpandedRowCell>
            <ExpandedRowLabel>Dernière validation</ExpandedRowLabel>
            <ValidationDateDetailsCell date={vigilanceArea.validatedAt} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Créée par </ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.createdBy}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell />
          <ExpandedRowCell />
          <ExpandedRowCell />
        </ExpandedRow>
      )}
    </>
  )
}

const ExpandableRowCell = styled(TableWithSelectableRows.Td)<{
  $isDraft: boolean
}>`
  cursor: pointer;
  user-select: none;
  color: ${p => (p.$isDraft ? p.theme.color.slateGray : p.theme.color.charcoal)};
  font-style: ${p => (p.$isDraft ? 'italic' : 'normal')};
`

const ExpandedRow = styled(TableWithSelectableRows.BodyTr)<{
  $isDraft: boolean
}>`
  > td {
    overflow: hidden !important;
    color: ${p => (p.$isDraft ? p.theme.color.slateGray : p.theme.color.charcoal)};
  }

  &:hover {
    > td {
      /* Hack to disable hover background color in expanded rows */
      background-color: ${p => p.theme.color.cultured};
    }
  }
`

const ExpandedRowCell = styled(TableWithSelectableRows.Td).attrs(props => ({
  ...props,
  $hasRightBorder: false
}))`
  padding: 8px 16px 16px;
  height: 42px;
  vertical-align: top;
  white-space: normal;

  > p:not(:first-child) {
    margin-top: 16px;
  }
`

const ExpandedRowLabel = styled.span`
  color: ${p => p.theme.color.slateGray};
  display: block;
  width: 100%;
`
const ExpandedRowValue = styled.span``
