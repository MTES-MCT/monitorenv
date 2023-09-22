import { Icon, Size } from '@mtes-mct/monitor-ui'

import { NavIconButton } from '../../../ui/NavIconButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { Base } from '../../../domain/entities/base'
import type { ColumnDef } from '@tanstack/react-table'

export const BASE_TABLE_COLUMNS: Array<ColumnDef<Base.Base>> = [
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
    accessorFn: row => row.controlUnitResources.length,
    header: () => 'Moyens',
    id: 'controlUnitResourcesCount',
    size: 96
  },
  {
    accessorFn: row => row.id,
    cell: info => (
      <NavIconButton
        Icon={Icon.Edit}
        size={Size.SMALL}
        title="Éditer cette base"
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}/${info.getValue<number>()}`}
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]
