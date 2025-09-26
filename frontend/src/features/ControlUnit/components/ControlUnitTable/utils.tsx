import { type ControlUnit, CustomSearch, type Filter, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'

import { CONTROL_UNIT_TABLE_COLUMNS } from './constants'

import type { FiltersState } from './types'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { Promisable } from 'type-fest'

export function getControlUnitTableColumns(
  askForArchivingConfirmation: (cellContext: CellContext<ControlUnit.ControlUnit, any>) => Promisable<void>,
  askForDeletionConfirmation: (cellContext: CellContext<ControlUnit.ControlUnit, any>) => Promisable<void>,
  isArchived: boolean = false
): Array<ColumnDef<ControlUnit.ControlUnit>> {
  const archiveColumn: ColumnDef<ControlUnit.ControlUnit> = {
    accessorFn: row => row,
    cell: cellContext => (
      <IconButton
        Icon={Icon.Archive}
        onClick={() => askForArchivingConfirmation(cellContext)}
        size={Size.SMALL}
        title="Archiver cette unité de contrôle"
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'archive',
    size: 44
  }

  const deleteColumn: ColumnDef<ControlUnit.ControlUnit> = {
    accessorFn: row => row,
    cell: cellContext => (
      <IconButton
        Icon={Icon.Delete}
        onClick={() => askForDeletionConfirmation(cellContext)}
        size={Size.SMALL}
        title="Supprimer cette unité de contrôle"
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'delete',
    size: 44
  }

  return !isArchived
    ? [...CONTROL_UNIT_TABLE_COLUMNS, archiveColumn, deleteColumn]
    : [...CONTROL_UNIT_TABLE_COLUMNS, deleteColumn]
}

export function getFilters(
  data: ControlUnit.ControlUnit[],
  filtersState: FiltersState
): Filter<ControlUnit.ControlUnit>[] {
  const customSearch = new CustomSearch(structuredClone(data), ['administration.name', 'name'], {
    cacheKey: 'BACK_OFFICE_CONTROL_UNIT_LIST',
    isStrict: true,
    withCacheInvalidation: true
  })
  const filters: Array<Filter<ControlUnit.ControlUnit>> = []

  // Search query
  // ⚠️ Order matters! Search query should be kept before other filters.
  if (filtersState.query && filtersState.query.trim().length > 0) {
    const queryFilter: Filter<ControlUnit.ControlUnit> = () => customSearch.find(filtersState.query as string)

    filters.push(queryFilter)
  }

  // Administration
  if (filtersState.administrationId) {
    const administrationIdFilter: Filter<ControlUnit.ControlUnit> = controlUnits =>
      controlUnits.filter(controlUnit => controlUnit.administrationId === filtersState.administrationId)

    filters.push(administrationIdFilter)
  }

  // Archived or not archived?
  const isArchivedFilter: Filter<ControlUnit.ControlUnit> = controlUnits =>
    controlUnits.filter(controlUnit => controlUnit.isArchived === filtersState.isArchived)

  filters.push(isArchivedFilter)

  return filters
}
