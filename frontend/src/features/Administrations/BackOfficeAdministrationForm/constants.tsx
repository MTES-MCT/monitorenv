import { Icon, Size } from '@mtes-mct/monitor-ui'
import { object, string } from 'yup'

import { NavIconButton } from '../../../ui/NavIconButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { AdministrationFormValues } from './types'
import type { ControlUnit } from '../../../domain/entities/controlUnit'
import type { ColumnDef } from '@tanstack/react-table'

export const ADMINISTRATION_FORM_SCHEMA = object({
  name: string().required('Le nom est obligatoire.')
})

export const CONTROL_UNIT_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnitData>> = [
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

export const INITIAL_ADMINISTRATION_FORM_VALUES: AdministrationFormValues = {
  name: undefined
}
