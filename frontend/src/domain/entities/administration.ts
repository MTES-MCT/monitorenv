import type { ControlUnit } from './controlUnit'

export namespace Administration {
  export interface Administration {
    controlUnitIds: number[]
    controlUnits: ControlUnit.ControlUnitData[]
    id: number
    isArchived: boolean
    name: string
  }

  // ---------------------------------------------------------------------------
  // Types

  export type AdministrationData = Omit<Administration, 'controlUnitIds' | 'controlUnits'>
  export type NewAdministrationData = Omit<AdministrationData, 'id'>
}
