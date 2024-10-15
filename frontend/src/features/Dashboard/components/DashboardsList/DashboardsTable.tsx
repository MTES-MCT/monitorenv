import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { Table } from '@components/Table'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'

import { Columns } from './Columns'

import type { Dashboard } from '@features/Dashboard/types'

interface DashboardsTableProps {
  dashboards: Dashboard.Dashboard[]
  isLoading: boolean
}

export function DashboardsTable({ dashboards, isLoading }: DashboardsTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { pathname } = useLocation()
  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -25 : 0

  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()
  const { data: controlUnits } = useGetControlUnitsQuery()

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(regulatoryAreas, controlUnits, legacyFirefoxOffset).map(column => ({
            ...column,
            cell: StyledSkeletonRow
          }))
        : Columns(regulatoryAreas, controlUnits, legacyFirefoxOffset),
    [isLoading, controlUnits, regulatoryAreas, legacyFirefoxOffset]
  )

  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'updatedAt' }])

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : dashboards), [isLoading, dashboards])

  const table = useReactTable({
    columns,
    data: tableData,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 43,
    getItemKey: useCallback((index: number) => `${rows[index]?.id}`, [rows]),
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
    scrollPaddingEnd: 40,
    scrollPaddingStart: 40
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  return <Table ref={tableContainerRef} rows={rows} table={table} virtualRows={virtualRows} />
}
