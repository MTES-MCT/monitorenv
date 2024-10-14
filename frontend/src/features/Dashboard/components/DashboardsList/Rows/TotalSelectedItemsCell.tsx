import type { Dashboard } from '@features/Dashboard/types'
import type { Row } from '@tanstack/react-table'

export function TotalSelectedItemsCell({ row }: { row: Row<Dashboard.Dashboard> }) {
  const dashboard = row?.original

  if (!dashboard) {
    return <span>0</span>
  }

  const totalSelectedItems =
    (dashboard.reportings?.length ?? 0) +
    (dashboard.regulatoryAreas?.length ?? 0) +
    (dashboard.controlUnits?.length ?? 0) +
    (dashboard.amps?.length ?? 0) +
    (dashboard.vigilanceAreas?.length ?? 0)

  return <span>{totalSelectedItems}</span>
}
