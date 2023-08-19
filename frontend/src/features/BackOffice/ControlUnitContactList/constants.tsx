import { Table } from '../../../ui/Table'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenu } from '../Menu/constants'

import type { ControlUnit } from '../../../domain/entities/controlUnit/types'
import type { ColumnDef } from '@tanstack/react-table'

export const CONTROL_UNIT_CONTACTS_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnitContact>> = [
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
        basePath={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]}`}
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
