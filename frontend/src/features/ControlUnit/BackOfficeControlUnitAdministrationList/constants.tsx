import { Table } from '../../../ui/Table'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { ControlUnit } from '../../../domain/entities/controlUnit/types'
import type { ColumnDef } from '@tanstack/react-table'

export const CONTROL_UNIT_ADMINISTRATION_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnitAdministration>> = [
  {
    accessorFn: row => row.id,
    enableSorting: false,
    header: () => 'ID',
    id: 'id',
    size: 64
  },
  {
    accessorFn: row => row.name,
    header: () => 'Nom',
    id: 'name'
  },
  {
    accessorFn: row => row.id,
    cell: info => (
      <Table.EditButton
        basePath={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_ADMINISTRATION_LIST]}`}
        id={info.getValue<number>()}
        title="Éditer cette administration"
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]
