import { number, object, string } from 'yup'

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
  }
]

export const CONTROL_UNIT_FORM_SCHEMA = object({
  administrationId: number().required('L’administration est obligatoire.'),
  department: string().trim().min(1).required('Le département est obligatoire.'),
  name: string().trim().min(1).required('Le nom est obligatoire.'),
  seaFront: string().required('La façade est obligatoire.')
})

export const INITIAL_CONTROL_UNIT_FORM_VALUES: ControlUnitFormValues = {
  administrationId: undefined,
  areaNote: undefined,
  department: undefined,
  isArchived: false,
  name: undefined,
  termsNote: undefined
}
