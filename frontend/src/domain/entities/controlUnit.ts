import type { Administration } from './administration'
import type { Base } from './base'

export namespace ControlUnit {
  export interface ControlUnit {
    administration: Administration.AdministrationData
    administrationId: number
    /** Area of intervention for this unit. */
    areaNote: string
    controlUnitContactIds: number[]
    controlUnitContacts: ControlUnitContactData[]
    controlUnitResourceIds: number[]
    // `ControlUnitResource` and not `ControlUnitResourceData` because we need `base` data for each resource
    controlUnitResources: ControlUnitResource[]
    id: number
    isArchived: boolean
    name: string
    /** Conditions under which this unit should be contacted. */
    termsNote: string
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
    base: Base.BaseData
    baseId: number | undefined
    controlUnit: ControlUnitData
    controlUnitId: number
    id: number
    name: string
    note: string | undefined
    /** Base64 Data URI. */
    photo: string | undefined
    type: ControlUnitResourceType
  }

  // ---------------------------------------------------------------------------
  // Constants

  // TODO Complete that with the first types list once it's ready.
  // TODO Keys in French or English?
  // Don't forget to mirror any update here in the backend enum.
  export enum ControlUnitResourceType {
    BARGE = 'Barge',
    FRIGATE = 'Frégate',
    LAND_VEHICLE = 'Véhicule terrestre',
    SCHOOL_BOAT = 'Bâtiment-École',
    UNKNOWN = 'Type inconnu'
  }

  // ---------------------------------------------------------------------------
  // Types

  export type ControlUnitData = Omit<
    ControlUnit,
    | 'administration'
    | 'controlUnitContactIds'
    | 'controlUnitContacts'
    | 'controlUnitResourceIds'
    | 'controlUnitResources'
  >
  export type NewControlUnitData = Omit<ControlUnitData, 'id'>

  export type ControlUnitContactData = Omit<ControlUnitContact, 'controlUnit'>
  export type NewControlUnitContactData = Omit<ControlUnitContactData, 'id'>

  export type ControlUnitResourceData = Omit<ControlUnitResource, 'base' | 'controlUnit'>
  export type NewControlUnitResourceData = Omit<ControlUnitResourceData, 'id'>
}
