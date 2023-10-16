import { CustomSearch, IconButton, type Filter, Size, Icon } from '@mtes-mct/monitor-ui'

import { BASE_TABLE_COLUMNS } from './constants'
import { backOfficeActions } from '../../../BackOffice/slice'
import { BackOfficeConfirmationModalActionType } from '../../../BackOffice/types'

import type { FiltersState } from './types'
import type { Base } from '../../../../domain/entities/base'
import type { AppDispatch } from '../../../../store'
import type { CellContext, ColumnDef } from '@tanstack/react-table'

function deleteBase(info: CellContext<Base.Base, unknown>, dispatch: AppDispatch) {
  const base = info.getValue<Base.Base>()

  dispatch(
    backOfficeActions.openConfirmationModal({
      actionType: BackOfficeConfirmationModalActionType.DELETE_BASE,
      entityId: base.id,
      modalProps: {
        confirmationButtonLabel: 'Supprimer',
        message: `Êtes-vous sûr de vouloir supprimer la base "${base.name}" ?`,
        title: `Suppression de la base`
      }
    })
  )
}

export function getBaseTableColumns(dispatch: AppDispatch): Array<ColumnDef<Base.Base>> {
  const deleteColumn: ColumnDef<Base.Base> = {
    accessorFn: row => row,
    cell: info => (
      <IconButton
        Icon={Icon.Delete}
        onClick={() => deleteBase(info, dispatch)}
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
