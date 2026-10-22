import { DateCell } from '@components/Table/Cells/DateCell'
import { LocalizeCell } from '@components/Table/Cells/LocalizeCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { type Row } from '@tanstack/react-table'
import styled from 'styled-components'

import { ControlUnitsCell } from '../Cells/ControlUnitsCell'
import { DashboardThemesCell } from '../Cells/DashboardThemesCell'
import { EditDashboardCell } from '../Cells/EditDashboardCell'
import { TotalSelectedItemsCell } from '../Cells/TotalSelectedItemsCell'

import type { Dashboard } from '@features/Dashboard/types'
import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { ControlUnit } from '@mtes-mct/monitor-ui'

export const Columns = (
  regulatoryAreas: RegulatoryArea.RegulatoryAreaFromAPI[],
  controlUnits: ControlUnit.ControlUnit[] | undefined,
  legacyFirefoxOffset: number = 0,
  isFetching: boolean = false
) => [
  {
    accessorFn: row => row.name,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span title={info.getValue()}>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'Nom',
    id: 'name',
    size: 400 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span title={info.getValue()}>{info.getValue()}</span>),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 160 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.createdAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Date de création',
    id: 'createdAt',
    size: 160 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.updatedAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Date de modif.',
    id: 'updatedAt',
    size: 160 + legacyFirefoxOffset,
    sortUndefined: 'last' as const
  },
  {
    accessorFn: row => row.controlUnitIds,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ControlUnitsCell controlUnitIds={info.getValue()} />),
    enableSorting: true,
    header: () => 'Unité',
    id: 'controlUnitIds',
    size: 325 + legacyFirefoxOffset,
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
    accessorFn: row => row.themes,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DashboardThemesCell themes={info.getValue()} />),
    enableSorting: true,
    header: () => 'Thématiques des zones sélectionnées',
    id: 'themes',
    size: 325 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<Dashboard.Dashboard>, rowB: Row<Dashboard.Dashboard>, columnId: string) => {
      const regIdA = rowA.original[columnId][0]
      const regIdB = rowB.original[columnId][0]

      const themeA: string = regulatoryAreas?.find(regulatoryArea => regulatoryArea.id === regIdA)?.layerName ?? ''
      const themeB: string = regulatoryAreas?.find(regulatoryArea => regulatoryArea.id === regIdB)?.layerName ?? ''

      return themeA?.localeCompare(themeB)
    }
  },
  {
    accessorFn: row => row,
    cell: ({ row }) => (isFetching ? <StyledSkeletonRow /> : <TotalSelectedItemsCell row={row} />),
    enableSorting: true,
    header: () => "Nb d'éléments sélectionnés",
    id: 'totalSelectedItems',
    size: 150 + legacyFirefoxOffset,
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
    accessorFn: row => ({ geom: row.geom, id: row.id }),
    cell: info =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <ButtonsGroup>
          <LocalizeCell geom={info.getValue().geom} />
          <EditDashboardCell id={info.getValue().id} />
        </ButtonsGroup>
      ),
    enableSorting: false,
    header: () => '',
    id: 'actions',
    size: 82 + legacyFirefoxOffset
  }
]

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`
