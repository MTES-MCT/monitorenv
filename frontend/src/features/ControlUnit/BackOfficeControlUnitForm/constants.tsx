import { number, object, string } from 'yup'

import { Table } from '../../../ui/Table'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'

import type { ControlUnitFormValues } from './types'
import type { ControlUnit } from '../../../domain/entities/controlUnit/types'
import type { ColumnDef } from '@tanstack/react-table'

export const CONTROL_UNIT_CONTACT_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnitContact>> = [
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
        basePath={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_CONTACT_LIST]}`}
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

export const CONTROL_UNIT_RESOURCE_TABLE_COLUMNS: Array<ColumnDef<ControlUnit.ControlUnitResource>> = [
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
        basePath={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_RESOURCE_LIST]}`}
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
