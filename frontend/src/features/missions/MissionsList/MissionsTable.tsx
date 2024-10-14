import { Table } from '@components/Table'
import { isLegacyFirefox } from '@utils/isLegacyFirefox'
import { paths } from 'paths'
import { useMemo, useRef } from 'react'
import { useLocation } from 'react-router'

import { Columns } from './Columns'
import { StyledSkeletonRow } from '../../commonComponents/Skeleton'

import type { Mission } from '../../../domain/entities/missions'

export function MissionsTable({ isLoading, missions }: { isLoading: boolean; missions: Mission[] }) {
  const { pathname } = useLocation()

  const legacyFirefoxOffset = pathname !== paths.sidewindow && isLegacyFirefox() ? -25 : 0

  const tableData = useMemo(() => (isLoading ? Array(5).fill({}) : missions), [isLoading, missions])

  const columns = useMemo(
    () =>
      isLoading
        ? Columns(legacyFirefoxOffset).map(column => ({ ...column, cell: StyledSkeletonRow }))
        : Columns(legacyFirefoxOffset),
    [isLoading, legacyFirefoxOffset]
  )

  const tableContainerRef = useRef<HTMLDivElement>(null)

  return <Table ref={tableContainerRef} columns={columns} data={tableData} />
}
