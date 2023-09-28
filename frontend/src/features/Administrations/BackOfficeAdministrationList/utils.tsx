import { CustomSearch, IconButton, type Filter, Icon, Size } from '@mtes-mct/monitor-ui'

import { ADMINISTRATION_TABLE_COLUMNS } from './constants'
import { openConfirmationModal } from '../../../domain/shared_slices/BackOffice'
import { BackOfficeConfirmationModalActionType } from '../../../domain/use_cases/backOffice/types'

import type { FiltersState } from './types'
import type { Administration } from '../../../domain/entities/administration'
import type { AppDispatch } from '../../../store'
import type { ColumnDef } from '@tanstack/react-table'

export function getAdministrationTableColumns(
  dispatch: AppDispatch,
  isArchived: boolean = false
): Array<ColumnDef<Administration.Administration>> {
  const archiveColumn: ColumnDef<Administration.Administration> = {
    accessorFn: row => row,
    cell: info => (
      <IconButton
        Icon={Icon.Archive}
        onClick={() =>
          dispatch(
            openConfirmationModal({
              actionId: info.getValue<Administration.Administration>().id,
              actionType: BackOfficeConfirmationModalActionType.ARCHIVE_ADMINISTRATION,
              message: `Êtes-vous sûr de vouloir archiver l'administration "${
                info.getValue<Administration.Administration>().name
              }" ?`
            })
          )
        }
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
    cell: info => (
      <IconButton
        Icon={Icon.Delete}
        onClick={() =>
          dispatch(
            openConfirmationModal({
              actionId: info.getValue<Administration.Administration>().id,
              actionType: BackOfficeConfirmationModalActionType.DELETE_ADMINISTRATION,
              message: `Êtes-vous sûr de vouloir supprimer l'administration "${
                info.getValue<Administration.Administration>().name
              }" ?`
            })
          )
        }
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
  const customSearch = new CustomSearch(data, ['name'], {
    cacheKey: 'BACK_OFFICE_ADMINISTRATION_LIST',
    isStrict: true
  })
  const filters: Array<Filter<Administration.Administration>> = []

  // Search query
  // ⚠️ Order matters! Search query should be before other filters.
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
