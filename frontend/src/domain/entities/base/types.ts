import type { ControlUnit } from '../controlUnit/types'

export namespace Base {
  export interface Base {
    controlUnitResourceIds: number[]
    controlUnitResources: ControlUnit.ControlUnitResourceData[]
    id: number
    name: string
  }

  // ---------------------------------------------------------------------------
  // Types

  export type BaseData = Omit<Base, 'controlUnitResources'>
  export type NewBaseData = Omit<BaseData, 'id'>
}
