import { CustomSearch, IconButton, type Filter, Size, Icon } from '@mtes-mct/monitor-ui'

import { STATION_TABLE_COLUMNS } from './constants'

import type { FiltersState } from './types'
import type { Station } from '../../../../domain/entities/station'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import type { Promisable } from 'type-fest'

export function getStationTableColumns(
  askForDeletionConfirmation: (cellContext: CellContext<Station.Station, any>) => Promisable<void>
): Array<ColumnDef<Station.Station>> {
  const deleteColumn: ColumnDef<Station.Station> = {
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

  return [...STATION_TABLE_COLUMNS, deleteColumn]
}

export function getFilters(data: Station.Station[], filtersState: FiltersState): Filter<Station.Station>[] {
  const customSearch = new CustomSearch(data, ['name'], {
    cacheKey: 'BACK_OFFICE_STATION_LIST',
    isStrict: true,
    withCacheInvalidation: true
  })
  const filters: Array<Filter<Station.Station>> = []

  if (filtersState.query && filtersState.query.trim().length > 0) {
    const filter: Filter<Station.Station> = () => customSearch.find(filtersState.query as string)

    filters.push(filter)
  }

  return filters
}
