import type { ControlUnit } from '../../../domain/entities/controlUnit/types'

export type Filter = (controlUnits: ControlUnit.ControlUnit[]) => ControlUnit.ControlUnit[]

export type FilterFormValues = {
  controlUnitAdministrationId?: number
  portId?: number
  query?: string
  type?: string
}
