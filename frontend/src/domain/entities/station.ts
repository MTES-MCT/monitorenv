import { type ControlUnit } from '@mtes-mct/monitor-ui'

export namespace Station {
  export interface Station {
    controlUnitResourceIds: number[]
    controlUnitResources: ControlUnit.ControlUnitResourceData[]
    id: number
    latitude: number
    longitude: number
    name: string
  }

  // ---------------------------------------------------------------------------
  // Types

  export type StationData = Omit<Station, 'controlUnitResourceIds' | 'controlUnitResources'>
  export type NewStationData = Omit<StationData, 'id'>
}
