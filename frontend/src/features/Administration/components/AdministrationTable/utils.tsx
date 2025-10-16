import { CustomSearch, IconButton, type Filter, Icon, Size } from '@mtes-mct/monitor-ui'

import { ADMINISTRATION_TABLE_COLUMNS } from './constants'

import type { FiltersState } from './types'
import type { Administration } from '../../../../domain/entities/administration'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { Promisable } from 'type-fest'

export function getAdministrationTableColumns(
  askForArchivingConfirmation: (cellContext: CellContext<Administration.Administration, unknown>) => Promisable<void>,
  askForDeletionConfirmation: (cellContext: CellContext<Administration.Administration, unknown>) => Promisable<void>,
  isArchived: boolean = false
): Array<ColumnDef<Administration.Administration>> {
  const archiveColumn: ColumnDef<Administration.Administration> = {
    accessorFn: row => row,
    cell: cellContext => (
      <IconButton
        Icon={Icon.Archive}
        onClick={() => askForArchivingConfirmation(cellContext)}
        size={Size.SMALL}
        title="Archiver cette administration"
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'archive',
    size: 44
  }

  const deleteColumn: ColumnDef<Administration.Administration> = {
    accessorFn: row => row,
    cell: cellContext => (
      <IconButton
        Icon={Icon.Delete}
        onClick={() => askForDeletionConfirmation(cellContext)}
        size={Size.SMALL}
        title="Supprimer cette administration"
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'delete',
    size: 44
  }

  return !isArchived
    ? [...ADMINISTRATION_TABLE_COLUMNS, archiveColumn, deleteColumn]
    : [...ADMINISTRATION_TABLE_COLUMNS, deleteColumn]
}

export function getFilters(
  data: Administration.Administration[],
  filtersState: FiltersState
): Filter<Administration.Administration>[] {
  const customSearch = new CustomSearch(structuredClone(data), ['name'], {
    cacheKey: 'BACK_OFFICE_ADMINISTRATION_LIST',
    isStrict: true,
    withCacheInvalidation: true
  })
  const filters: Array<Filter<Administration.Administration>> = []

  // Search query
  // ⚠️ Order matters! Search query should be kept before other filters.
  if (filtersState.query && filtersState.query.trim().length > 0) {
    const queryFilter: Filter<Administration.Administration> = () => customSearch.find(filtersState.query as string)

    filters.push(queryFilter)
  }

  // Archived or not archived?
  const isArchivedFilter: Filter<Administration.Administration> = administrations =>
    administrations.filter(administration => administration.isArchived === filtersState.isArchived)

  filters.push(isArchivedFilter)

  return filters
}
