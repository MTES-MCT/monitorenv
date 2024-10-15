import { Table } from '@components/Table'
import { getCoreRowModel, getSortedRowModel, useReactTable, type SortingState } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'

import { Columns } from './Columns'
import { StyledSkeletonRow } from '../../commonComponents/Skeleton'

import type { Mission } from '../../../domain/entities/missions'

export function MissionsTable({ isLoading, missions }: { isLoading: boolean; missions: Mission[] }) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { pathname } = useLocation()
  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -25 : 0

  const [sorting, setSorting] = useState<SortingState>([{ desc: true, id: 'startDate' }])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset),
    [isLoading, legacyFirefoxOffset]
  )

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : missions), [isLoading, missions])

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
    estimateSize: () => 40,
    getItemKey: useCallback((index: number) => `${rows[index]?.id}`, [rows]),
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
    scrollPaddingEnd: 40,
    scrollPaddingStart: 40
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  return <Table ref={tableContainerRef} rows={rows} table={table} virtualRows={virtualRows} />
}
