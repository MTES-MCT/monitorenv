import type { Base } from '../base/types'

export namespace ControlUnit {
  export interface ControlUnit {
    /** Area of intervention for this unit. */
    areaNote: string
    controlUnitAdministration: ControlUnitAdministrationData
    controlUnitAdministrationId: number
    controlUnitContactIds: number[]
    controlUnitContacts: ControlUnitContactData[]
    controlUnitResourceIds: number[]
    controlUnitResources: Array<
      ControlUnitResourceData & {
        port: Base.BaseData
      }
    >
    id: number
    isArchived: boolean
    name: string
    /** Conditions under which this unit should be contacted. */
    termsNote: string
  }

  export interface ControlUnitAdministration {
    controlUnitIds: number[]
    controlUnits: ControlUnitData[]
    id: number
    name: string
  }

  export interface ControlUnitContact {
    controlUnit: ControlUnitData
    controlUnitId: number
    email: string | undefined
    id: number
    name: string
    note: string | undefined
    phone: string | undefined
  }

  export interface ControlUnitResource {
    controlUnit: ControlUnitData
    controlUnitId: number
    id: number
    name: string
    note: string | undefined
    /** Base64 Data URI. */
    photo: string | undefined
    // TODO Make that non-undefinable once all resources will have been attached to a base.
    port: Base.BaseData | undefined
    portId: number | undefined
    // TODO Make that non-undefinable once all resources will have been attached to a type.
    type: ControlUnitResourceType | undefined
  }

  // ---------------------------------------------------------------------------
  // Constants

  // TODO Complete that with the first types list once it's ready.
  // TODO Keys in French or English?
  // Don't forget to mirror any update here in the backend enum.
  export enum ControlUnitResourceType {
    BARGE = 'Barge',
    FRIGATE = 'Frégate',
    SCHOOL_BOAT = 'Bâtiment-École'
  }

  // ---------------------------------------------------------------------------
  // Types

  export type ControlUnitData = Omit<
    ControlUnit,
    'controlUnitAdministration' | 'controlUnitContacts' | 'controlUnitResources'
  >
  export type NewControlUnitData = Omit<ControlUnitData, 'id'>

  export type ControlUnitAdministrationData = Omit<ControlUnitAdministration, 'controlUnits'>
  export type NewControlUnitAdministrationData = Omit<ControlUnitAdministrationData, 'id'>

  export type ControlUnitContactData = Omit<ControlUnitContact, 'controlUnit'>
  export type NewControlUnitContactData = Omit<ControlUnitContactData, 'id'>

  export type ControlUnitResourceData = Omit<ControlUnitResource, 'controlUnit' | 'port'>
  export type NewControlUnitResourceData = Omit<ControlUnitResourceData, 'id'>
}
