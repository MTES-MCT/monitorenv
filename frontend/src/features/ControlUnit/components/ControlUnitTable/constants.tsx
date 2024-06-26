import { type ControlUnit, Icon, Size } from '@mtes-mct/monitor-ui'

import { NavIconButton } from '../../../../ui/NavIconButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'

import type { ColumnDef } from '@tanstack/react-table'

export const CONTROL_UNIT_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnit>> = [
  {
    accessorFn: row => row.id,
    enableSorting: false,
    header: () => 'ID',
    id: 'id',
    size: 64
  },
  {
    accessorFn: row => row.administration.name,
    header: () => 'Administration',
    id: 'administrationName',
    size: 240
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
    accessorFn: row => row.controlUnitContacts.length,
    header: () => 'Contacts',
    id: 'controlUnitContactsCount',
    size: 96
  },
  {
    accessorFn: row => row.id,
    cell: info => (
      <NavIconButton
        Icon={Icon.Edit}
        size={Size.SMALL}
        title="Éditer cette unité de contrôle"
        to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/${info.getValue<number>()}`}
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]
