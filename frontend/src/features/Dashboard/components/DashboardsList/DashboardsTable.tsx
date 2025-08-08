import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { Table } from '@components/Table'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { useTable } from '@hooks/useTable'
import { useTableVirtualizer } from '@hooks/useTableVirtualizer'
import { type SortingState } from '@tanstack/react-table'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'

import { Columns } from './Columns'

import type { Dashboard } from '@features/Dashboard/types'

interface DashboardsTableProps {
  dashboards: Dashboard.Dashboard[]
  isFetching: boolean
  isLoading: boolean
}

export function DashboardsTable({ dashboards, isFetching, isLoading }: DashboardsTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { pathname } = useLocation()
  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -25 : 0

  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()
  const { data: controlUnits } = useGetControlUnitsQuery()

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(Object.values(regulatoryAreas?.entities ?? {}), controlUnits, legacyFirefoxOffset, false).map(
            column => ({
              ...column,
              cell: StyledSkeletonRow
            })
          )
        : Columns(Object.values(regulatoryAreas?.entities ?? {}), controlUnits, legacyFirefoxOffset, isFetching),
    [isFetching, isLoading, controlUnits, regulatoryAreas, legacyFirefoxOffset]
  )

  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'updatedAt' }])
  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : dashboards), [isLoading, dashboards])

  const table = useTable({
    columns,
    data: tableData,
    setSorting,
    sorting,
    withRowSelection: false
  })

  const { rows } = useMemo(() => table.getRowModel(), [table])
  const rowVirtualizer = useTableVirtualizer({ estimateSize: 30, ref: tableContainerRef, rows })

  const virtualRows = useMemo(() => rowVirtualizer.getVirtualItems(), [rowVirtualizer])

  return (
    <Table
      ref={tableContainerRef}
      columnsLength={columns.length}
      rows={rows}
      rowVirtualizer={rowVirtualizer}
      table={table}
      virtualRows={virtualRows}
    />
  )
}
