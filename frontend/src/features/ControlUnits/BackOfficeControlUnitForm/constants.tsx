import { Icon, Size } from '@mtes-mct/monitor-ui'
import { number, object, string } from 'yup'

import { NavIconButton } from '../../../ui/NavIconButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { ControlUnitFormValues } from './types'
import type { ControlUnit } from '../../../domain/entities/controlUnit'
import type { ColumnDef } from '@tanstack/react-table'

export const CONTROL_UNIT_CONTACT_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnitContactData>> = [
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
        title="Éditer cette administration"
        to={`/backoffice${
          BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]
        }/${info.getValue<number>()}`}
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]

export const CONTROL_UNIT_RESOURCE_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnitResourceData>> = [
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
        title="Éditer cette administration"
        to={`/backoffice${
          BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]
        }/${info.getValue<number>()}`}
      />
    ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]

export const CONTROL_UNIT_FORM_SCHEMA = object({
  administrationId: number().required('L’administration est obligatoire.'),
  name: string().required('Le nom est obligatoire.')
})

export const INITIAL_CONTROL_UNIT_FORM_VALUES: ControlUnitFormValues = {
  administrationId: undefined,
  areaNote: undefined,
  controlUnitContactIds: [],
  controlUnitResourceIds: [],
  isArchived: false,
  name: undefined,
  termsNote: undefined
}
