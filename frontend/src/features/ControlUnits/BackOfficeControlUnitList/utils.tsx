import { CustomSearch, type Filter, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'

import { CONTROL_UNIT_TABLE_COLUMNS } from './constants'
import { openConfirmationModal } from '../../../domain/shared_slices/BackOffice'
import { BackOfficeConfirmationModalActionType } from '../../../domain/use_cases/backOffice/types'

import type { FiltersState } from './types'
import type { ControlUnit } from '../../../domain/entities/controlUnit'
import type { AppDispatch } from '../../../store'
import type { CellContext, ColumnDef } from '@tanstack/react-table'

function archiveControlUnit(info: CellContext<ControlUnit.ControlUnit, unknown>, dispatch: AppDispatch) {
  const controlUnit = info.getValue<ControlUnit.ControlUnit>()

  dispatch(
    openConfirmationModal({
      actionId: controlUnit.id,
      actionType: BackOfficeConfirmationModalActionType.ARCHIVE_CONTROL_UNIT,
      message: `Confirmez-vous l'archivage de l'unité "${controlUnit.name}" ? Elle n'apparaîtra plus dans MonitorEnv, elle ne sera plus utilisée que pour les statistiques.`
    })
  )
}

function deleteControlUnit(info: CellContext<ControlUnit.ControlUnit, unknown>, dispatch: AppDispatch) {
  const controlUnit = info.getValue<ControlUnit.ControlUnit>()

  dispatch(
    openConfirmationModal({
      actionId: controlUnit.id,
      actionType: BackOfficeConfirmationModalActionType.DELETE_CONTROL_UNIT,
      message: `Confirmez-vous la suppression de l'unité "${controlUnit.name}" ? Ceci entraînera la suppression de toutes ses informations (moyens, contacts...).`
    })
  )
}

export function getControlUnitTableColumns(
  dispatch: AppDispatch,
  isArchived: boolean = false
): Array<ColumnDef<ControlUnit.ControlUnit>> {
  const archiveColumn: ColumnDef<ControlUnit.ControlUnit> = {
    accessorFn: row => row,
    cell: info => (
      <IconButton
        Icon={Icon.Archive}
        onClick={() => archiveControlUnit(info, dispatch)}
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
    cell: info => (
      <IconButton
        Icon={Icon.Delete}
        onClick={() => deleteControlUnit(info, dispatch)}
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
  const customSearch = new CustomSearch(data, ['administration.name', 'name'], {
    cacheKey: 'BACK_OFFICE_CONTROL_UNIT_LIST',
    isStrict: true
  })
  const filters: Array<Filter<ControlUnit.ControlUnit>> = []

  // Search query
  // ⚠️ Order matters! Search query should be before other filters.
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
