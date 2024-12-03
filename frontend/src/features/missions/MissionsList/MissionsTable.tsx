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

import type { Mission } from '../../../domain/entities/missions'

type MissionsTableProps = {
  isFetching: boolean
  isLoading: boolean
  missions: Mission[]
}

export function MissionsTable({ isFetching, isLoading, missions }: MissionsTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { pathname } = useLocation()
  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -25 : 0

  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'startDate' }])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset, false).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset, isFetching),
    [isLoading, isFetching, legacyFirefoxOffset]
  )

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : missions), [isLoading, missions])

  const table = useTable({
    columns,
    data: tableData,
    setSorting,
    sorting,
    withRowSelection: false
  })

  const { rows } = table.getRowModel()

  const overscan = useMemo(() => (missions.length > 500 ? 500 : 50), [missions])

  const rowVirtualizer = useTableVirtualizer({ estimateSize: 30, overscan, ref: tableContainerRef, rows })

  const virtualRows = rowVirtualizer.getVirtualItems()

  return <Table ref={tableContainerRef} rows={rows} table={table} virtualRows={virtualRows} />
}
