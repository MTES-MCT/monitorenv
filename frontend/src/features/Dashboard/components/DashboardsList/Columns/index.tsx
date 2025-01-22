import { DateCell } from '@components/Table/DateCell'
import { LocalizeCell } from '@components/Table/LocalizeCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { type Row } from '@tanstack/react-table'

import { ControlUnitsCell } from '../Rows/ControlUnitsCell'
import { EditDashboardCell } from '../Rows/EditDashboardCell'
import { RegulatoryAreasThemesCell } from '../Rows/RegulatoryAreasThemesCell'
import { TotalSelectedItemsCell } from '../Rows/TotalSelectedItemsCell'

import type { Dashboard } from '@features/Dashboard/types'
import type { ControlUnit } from '@mtes-mct/monitor-ui'
import type { RegulatoryLayerCompactFromAPI } from 'domain/entities/regulatory'

export const Columns = (
  regulatoryAreas: RegulatoryLayerCompactFromAPI[],
  controlUnits: ControlUnit.ControlUnit[] | undefined,
  legacyFirefoxOffset: number = 0,
  isFetching: boolean = false
) => [
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span title={info.getValue()}>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 104 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.name,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span title={info.getValue()}>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'Nom',
    id: 'name',
    size: 215 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.createdAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Créé le ...',
    id: 'createdAt',
    size: 212 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.updatedAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Mis à jour le ...',
    id: 'updatedAt',
    size: 212 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.controlUnitIds,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ControlUnitsCell controlUnitIds={info.getValue()} />),
    enableSorting: true,
    header: () => 'Unité (Administration)',
    id: 'controlUnitIds',
    size: 343 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<Dashboard.Dashboard>, rowB: Row<Dashboard.Dashboard>, columnId: string) => {
      const firstControlUnitIdA = rowA.original[columnId][0]
      const firstCcontrolUnitIdB = rowB.original[columnId][0]

      const controlUnitA: string = controlUnits?.find(controlUnit => controlUnit.id === firstControlUnitIdA)?.name ?? ''
      const controlUnitB: string =
        controlUnits?.find(controlUnit => controlUnit.id === firstCcontrolUnitIdB)?.name ?? ''

      return controlUnitA?.localeCompare(controlUnitB)
    }
  },
  {
    accessorFn: row => row.regulatoryAreaIds,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <RegulatoryAreasThemesCell themeIds={info.getValue()} />),
    enableSorting: true,
    header: () => 'Thématiques reg. des zones sélectionnées',
    id: 'regulatoryAreaIds',
    size: 365 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<Dashboard.Dashboard>, rowB: Row<Dashboard.Dashboard>, columnId: string) => {
      const themeIdA = rowA.original[columnId][0]
      const themeIdB = rowB.original[columnId][0]

      const themeA: string = regulatoryAreas?.[themeIdA]?.layer_name ?? ''
      const themeB: string = regulatoryAreas?.[themeIdB]?.layer_name ?? ''

      return themeA?.localeCompare(themeB)
    }
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <TotalSelectedItemsCell row={row} />),
    enableSorting: true,
    header: () => "Nb d'éléments sélectionnés",
    id: 'totalSelectedItems',
    size: 221 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<Dashboard.Dashboard>, rowB: Row<Dashboard.Dashboard>) => {
      const dashboardA = rowA.original
      const totalSelectedItemsA =
        (dashboardA?.reportingIds?.length ?? 0) +
        (dashboardA?.regulatoryAreaIds?.length ?? 0) +
        (dashboardA.controlUnitIds?.length ?? 0) +
        (dashboardA.ampIds?.length ?? 0) +
        (dashboardA.vigilanceAreaIds?.length ?? 0)

      const dashboardB = rowB.original
      const totalSelectedItemsB =
        (dashboardB?.reportingIds?.length ?? 0) +
        (dashboardB?.regulatoryAreaIds?.length ?? 0) +
        (dashboardB.controlUnitIds?.length ?? 0) +
        (dashboardB.ampIds?.length ?? 0) +
        (dashboardB.vigilanceAreaIds?.length ?? 0)

      return totalSelectedItemsA - totalSelectedItemsB
    }
  },
  {
    accessorFn: row => row.geom,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <LocalizeCell geom={info.getValue()} />),
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 52 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.id,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <EditDashboardCell id={info.getValue()} />),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 52 + legacyFirefoxOffset
  }
]
