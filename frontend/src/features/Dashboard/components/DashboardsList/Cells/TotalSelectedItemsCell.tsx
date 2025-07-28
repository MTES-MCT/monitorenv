import type { Dashboard } from '@features/Dashboard/types'
import type { Row } from '@tanstack/react-table'

export function TotalSelectedItemsCell({ row }: { row: Row<Dashboard.Dashboard> }) {
  const dashboard = row?.original

  if (!dashboard) {
    return <span>0</span>
  }

  const totalSelectedItems =
    (dashboard.reportingIds?.length ?? 0) +
    (dashboard.regulatoryAreaIds?.length ?? 0) +
    (dashboard.controlUnitIds?.length ?? 0) +
    (dashboard.ampIds?.length ?? 0) +
    (dashboard.vigilanceAreaIds?.length ?? 0)

  return <span>{totalSelectedItems}</span>
}
