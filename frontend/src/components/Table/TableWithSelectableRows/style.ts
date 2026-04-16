import { TableWithSelectableRows } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const ExpandableRowCell = styled(TableWithSelectableRows.Td)<{
  $isDraft?: boolean
}>`
  cursor: pointer;
  user-select: none;
  color: ${p => (p.$isDraft ? p.theme.color.slateGray : p.theme.color.charcoal)};
  font-style: ${p => (p.$isDraft ? 'italic' : 'normal')};
`

export const ExpandedRow = styled(TableWithSelectableRows.BodyTr)<{
  $isDraft?: boolean
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

export const ExpandedRowCell = styled(TableWithSelectableRows.Td).attrs(props => ({
  ...props,
  $hasRightBorder: false
}))`
  padding: 8px 16px 16px;
  height: 42px;
  vertical-align: top;

  > p:not(:first-child) {
    margin-top: 16px;
  }

  max-width: 350px;
`

export const ExpandedRowLabel = styled.span`
  color: ${p => p.theme.color.slateGray};
  display: block;
  width: 100%;
`
export const ExpandedRowValue = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 50;
  overflow: hidden;
  white-space: pre-wrap;
`

export const ExpandedRowList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
