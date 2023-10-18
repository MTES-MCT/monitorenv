import { Icon, Size } from '@mtes-mct/monitor-ui'

import { NavIconButton } from '../../../../ui/NavIconButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'

import type { Administration } from '../../../../domain/entities/administration'
import type { ColumnDef } from '@tanstack/react-table'

export const ADMINISTRATION_TABLE_COLUMNS: Array<ColumnDef<Administration.Administration>> = [
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
    accessorFn: row => row.controlUnits.length,
    header: () => 'Unités',
    id: 'controlUnitsCount',
    size: 96
  },
  {
    accessorFn: row => row.id,
    cell: info => (
      <NavIconButton
        Icon={Icon.Edit}
        size={Size.SMALL}
        title="Éditer cette administration"
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}/${info.getValue<number>()}`}
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]
