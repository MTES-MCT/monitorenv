import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { Table } from '@components/Table'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef } from 'react'
import { useLocation } from 'react-router'

import { Columns } from './Columns'

import type { Dashboard } from '@features/Dashboard/types'

interface DashboardsTableProps {
  dashboards: Dashboard.Dashboard[]
  isLoading: boolean
}

export function DashboardsTable({ dashboards, isLoading }: DashboardsTableProps) {
  const { pathname } = useLocation()

  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()
  const { data: controlUnits } = useGetControlUnitsQuery()

  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -25 : 0

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : dashboards), [isLoading, dashboards])

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

  const tableContainerRef = useRef<HTMLDivElement>(null)

  return <Table ref={tableContainerRef} columns={columns} data={tableData} />
}
