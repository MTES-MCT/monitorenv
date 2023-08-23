import { Table } from '../../../ui/Table'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { Port } from '../../../domain/entities/port/types'
import type { ColumnDef } from '@tanstack/react-table'

export const PORT_TABLE_COLUMNS: Array<ColumnDef<Port.Port>> = [
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
        basePath={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.PORT_LIST]}`}
        id={info.getValue<number>()}
        title="Éditer ce port"
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]
