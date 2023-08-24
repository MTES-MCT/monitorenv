import type { ControlUnit } from '../ControlUnit/types'

export namespace Administration {
  export interface Administration {
    controlUnitIds: number[]
    controlUnits: ControlUnit.ControlUnitData[]
    id: number
    name: string
  }

  // ---------------------------------------------------------------------------
  // Types

  export type AdministrationData = Omit<Administration, 'controlUnits'>
  export type NewAdministrationData = Omit<AdministrationData, 'id'>
}
