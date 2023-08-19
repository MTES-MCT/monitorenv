import type { ControlUnit } from '../controlUnit/types'

export namespace Port {
  export interface Port {
    controlUnitResourceIds: number[]
    controlUnitResources: ControlUnit.ControlUnitResourceData[]
    id: number
    name: string
  }

  // ---------------------------------------------------------------------------
  // Types

  export type PortData = Omit<Port, 'controlUnitResources'>
  export type NewPortData = Omit<PortData, 'id'>
}
