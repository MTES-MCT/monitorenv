import { CustomSearch, IconButton, type Filter, Size, Icon } from '@mtes-mct/monitor-ui'

import { BASE_TABLE_COLUMNS } from './constants'

import type { FiltersState } from './types'
import type { Base } from '../../../../domain/entities/base'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { Promisable } from 'type-fest'

export function getBaseTableColumns(
  askForDeletionConfirmation: (cellContext: CellContext<Base.Base, unknown>) => Promisable<void>
): Array<ColumnDef<Base.Base>> {
  const deleteColumn: ColumnDef<Base.Base> = {
    accessorFn: row => row,
    cell: cellContext => (
      <IconButton
        Icon={Icon.Delete}
        onClick={() => askForDeletionConfirmation(cellContext)}
        size={Size.SMALL}
        title="Supprimer cette base"
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'delete',
    size: 44
  }

  return [...BASE_TABLE_COLUMNS, deleteColumn]
}

export function getFilters(data: Base.Base[], filtersState: FiltersState): Filter<Base.Base>[] {
  const customSearch = new CustomSearch(data, ['name'], {
    cacheKey: 'BACK_OFFICE_BASE_LIST',
    isStrict: true
  })
  const filters: Array<Filter<Base.Base>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const filter: Filter<Base.Base> = () => customSearch.find(filtersState.query as string)

    filters.push(filter)
  }

  return filters
}
