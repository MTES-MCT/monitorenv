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
    controlUnitResources: Array<
      ControlUnitResourceData & {
        base: Base.BaseData
      }
    >
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
    // TODO Make that non-undefinable once all resources will have been attached to a base.
    base: Base.BaseData | undefined
    baseId: number | undefined
    controlUnit: ControlUnitData
    controlUnitId: number
    id: number
    name: string
    note: string | undefined
    /** Base64 Data URI. */
    photo: string | undefined
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
    LAND_VEHICLE = 'Véhicule terrestre',
    SCHOOL_BOAT = 'Bâtiment-École'
  }

  // ---------------------------------------------------------------------------
  // Types

  export type ControlUnitData = Omit<ControlUnit, 'administration' | 'controlUnitContacts' | 'controlUnitResources'>
  export type NewControlUnitData = Omit<ControlUnitData, 'id'>

  export type ControlUnitContactData = Omit<ControlUnitContact, 'controlUnit'>
  export type NewControlUnitContactData = Omit<ControlUnitContactData, 'id'>

  export type ControlUnitResourceData = Omit<ControlUnitResource, 'base' | 'controlUnit'>
  export type NewControlUnitResourceData = Omit<ControlUnitResourceData, 'id'>
}
