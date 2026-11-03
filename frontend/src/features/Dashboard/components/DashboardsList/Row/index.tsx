import { BaseRow } from '@components/Table/TableWithSelectableRows/BaseRow'
import {
  ExpandedRow,
  ExpandedRowCell,
  ExpandedRowLabel,
  ExpandedRowList,
  ExpandedRowValue
} from '@components/Table/TableWithSelectableRows/style'
import { UNKNOWN } from '@components/Table/TableWithSelectableRows/utils'
import { ControlUnitsWithAdminCell } from '@features/Dashboard/components/DashboardsList/Row/ControlUnitsWithAdminCell'
import { Dashboard } from '@features/Dashboard/types'
import { TagsDetailsCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/TagsDetailsCell'
import { ThemesDetailsCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/ThemesDetailsCell'
import { type Row as RowType } from '@tanstack/react-table'

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

  return (
    <BaseRow
      key={row.id}
      data-cy="dashboard-row"
      row={row}
      rowVirtualizer={rowVirtualizer}
      stickyLeftBorderIndex={0}
      virtualRow={virtualRow}
    >
      {row.getIsExpanded() && (
        <ExpandedRow data-cy="dashboard-row-expanded">
          <ExpandedRowCell colSpan={4}>
            <ExpandedRowLabel>Commentaires</ExpandedRowLabel>
            <ExpandedRowValue>{dashboard.comments ?? UNKNOWN}</ExpandedRowValue>
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ControlUnitsWithAdminCell controlUnitIds={dashboard.controlUnitIds} />
          </ExpandedRowCell>
          <ExpandedRowCell>
            <ExpandedRowList>
              <li>
                <ExpandedRowLabel>Thématiques et sous-thématiques</ExpandedRowLabel>
                <ThemesDetailsCell themes={dashboard.themes} />
              </li>
              <li>
                <ExpandedRowLabel>Tags et sous-tags</ExpandedRowLabel>
                <TagsDetailsCell tags={dashboard.tags} />
              </li>
            </ExpandedRowList>
          </ExpandedRowCell>
          <ExpandedRowCell colSpan={2}>
            <ExpandedRowList>
              {dashboard.regulatoryAreaIds.length > 0 && (
                <li>
                  <ExpandedRowLabel>Zones reg.</ExpandedRowLabel>
                  <ExpandedRowValue>{dashboard.regulatoryAreaIds.length}</ExpandedRowValue>
                </li>
              )}
              {dashboard.ampIds.length > 0 && (
                <li>
                  <ExpandedRowLabel>AMP</ExpandedRowLabel>
                  <ExpandedRowValue>{dashboard.ampIds.length}</ExpandedRowValue>
                </li>
              )}
              {dashboard.vigilanceAreaIds.length > 0 && (
                <li>
                  <ExpandedRowLabel>Z. vigilance</ExpandedRowLabel>
                  <ExpandedRowValue>{dashboard.vigilanceAreaIds.length}</ExpandedRowValue>
                </li>
              )}
              {dashboard.reportingIds.length > 0 && (
                <li>
                  <ExpandedRowLabel>Signalements</ExpandedRowLabel>
                  <ExpandedRowValue>{dashboard.reportingIds.length}</ExpandedRowValue>
                </li>
              )}
            </ExpandedRowList>
          </ExpandedRowCell>
        </ExpandedRow>
      )}
    </BaseRow>
  )
}
