import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import { flexRender } from '@tanstack/react-table'
import styled from 'styled-components'

export function Row({ row }) {
  const vigilanceArea = row.original

  return (
    <>
      <TableWithSelectableRows.BodyTr key={row.key} data-cy="vigilance-area-row">
        {row?.getVisibleCells().map(cell => (
          <ExpandableRowCell
            key={cell.id}
            $hasRightBorder={cell.column.id === 'geom'}
            $isCenter={cell.column.id === 'geom' || cell.column.id === 'edit'}
            $isDraft={!!vigilanceArea.isDraft}
            onClick={() => row.toggleExpanded()}
            style={{
              maxWidth: cell.column.getSize(),
              minWidth: cell.column.getSize(),
              width: cell.column.getSize()
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </ExpandableRowCell>
        ))}
      </TableWithSelectableRows.BodyTr>
      {row.getIsExpanded() && (
        <ExpandedRow $isDraft={!!vigilanceArea.isDraft} data-id={`${row.id}-expanded`}>
          <ExpandedRowCell>
            <ExpandedRowLabel>Commentaire</ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.comment}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Récurrence</ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.comment}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Thématiques</ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.comment}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowLabel>Tags</ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.comment}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell />
          <ExpandedRowCell>
            <ExpandedRowLabel>Dernière validation</ExpandedRowLabel>
            <ExpandedRowValue>{vigilanceArea.comment}</ExpandedRowValue>
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
  font-weight: 400;
  width: 100%;
`
const ExpandedRowValue = styled.span``
