import type { Administration } from './administration'
import type { Base } from './base'
import type { DepartmentArea } from './departmentArea'

export namespace ControlUnit {
  export interface ControlUnit {
    administration: Administration.AdministrationData
    administrationId: number
    /** Area of intervention for this unit. */
    areaNote: string | undefined
    controlUnitContactIds: number[]
    controlUnitContacts: ControlUnitContactData[]
    controlUnitResourceIds: number[]
    // `ControlUnitResource` and not `ControlUnitResourceData` because we need `base` data for each resource
    controlUnitResources: ControlUnitResource[]
    departmentArea: DepartmentArea.DepartmentArea | undefined
    /** `departmentAreaInseeCode` is the `departmentArea` ID. */
    departmentAreaInseeCode: string | undefined
    id: number
    isArchived: boolean
    name: string
    /** Conditions under which this unit should be contacted. */
    termsNote: string | undefined
  }

  export interface ControlUnitContact {
    controlUnit: ControlUnitData
    controlUnitId: number
    email: string | undefined
    id: number
    name: string
    phone: string | undefined
  }

  export interface ControlUnitResource {
    base: Base.BaseData
    baseId: number | undefined
    controlUnit: ControlUnitData
    controlUnitId: number
    id: number
    isArchived: boolean
    name: string
    note: string | undefined
    /** Base64 Data URI. */
    photo: string | undefined
    type: ControlUnitResourceType
  }

  // ---------------------------------------------------------------------------
  // Constants

  export enum ControlUnitContactName {
    ADJUNCT = 'Adjoint',
    BRIDGE = 'Passerelle',
    CHIEF = 'Chef',
    COMMANDER = 'Commandant',
    COMMANDER_A = 'Commandant bordée A',
    COMMANDER_B = 'Commandant bordée B',
    CREW_A = 'Équipage A',
    CREW_B = 'Équipage B',
    DML = 'DML',
    DOCK = 'Quai',
    LAND = 'Terre',
    LAND_ON_CALL = 'Permanence terre',
    NEAR_COAST = 'Proche côte',
    OFFICE = 'Bureau de l’unité',
    ONBOARD_PHONE = 'Téléphone de bord',
    ON_CALL = 'Permanence',
    SEA = 'Mer',
    SECRETARIAT = 'Secrétariat',
    SERVICE_CHIEF = 'Chef de service',
    UNIT_CHIEF = 'Chef d’unité',
    UNKNOWN = 'Nom de contact non renseigné'
  }

  // Don't forget to mirror any update here in both Postgre & Backend enums.
  export enum ControlUnitResourceType {
    AIRPLANE = 'AIRPLANE',
    BARGE = 'BARGE',
    CAR = 'CAR',
    DRONE = 'DRONE',
    EQUESTRIAN = 'EQUESTRIAN',
    FAST_BOAT = 'FAST_BOAT',
    FRIGATE = 'FRIGATE',
    HELICOPTER = 'HELICOPTER',
    HYDROGRAPHIC_SHIP = 'HYDROGRAPHIC_SHIP',
    KAYAK = 'KAYAK',
    LIGHT_FAST_BOAT = 'LIGHT_FAST_BOAT',
    MINE_DIVER = 'MINE_DIVER',
    MOTORCYCLE = 'MOTORCYCLE',
    NET_LIFTER = 'NET_LIFTER',
    NO_RESOURCE = 'NO_RESOURCE',
    OTHER = 'OTHER',
    PATROL_BOAT = 'PATROL_BOAT',
    PEDESTRIAN = 'PEDESTRIAN',
    PIROGUE = 'PIROGUE',
    RIGID_HULL = 'RIGID_HULL',
    SEA_SCOOTER = 'SEA_SCOOTER',
    SEMI_RIGID = 'SEMI_RIGID',
    SUPPORT_SHIP = 'SUPPORT_SHIP',
    TRAINING_SHIP = 'TRAINING_SHIP',
    TUGBOAT = 'TUGBOAT'
  }
  export enum ControlUnitResourceTypeLabel {
    AIRPLANE = 'Avion',
    BARGE = 'Barge',
    CAR = 'Voiture',
    DRONE = 'Drône',
    EQUESTRIAN = 'Équestre',
    FAST_BOAT = 'Vedette',
    FRIGATE = 'Frégate',
    HELICOPTER = 'Hélicoptère',
    HYDROGRAPHIC_SHIP = 'Bâtiment hydrographique',
    KAYAK = 'Kayak',
    LIGHT_FAST_BOAT = 'Vedette légère',
    MINE_DIVER = 'Plongeur démineur',
    MOTORCYCLE = 'Moto',
    NET_LIFTER = 'Remonte-filets',
    NO_RESOURCE = 'Aucun moyen',
    OTHER = 'Autre',
    PATROL_BOAT = 'Patrouilleur',
    PEDESTRIAN = 'Piéton',
    PIROGUE = 'Pirogue',
    RIGID_HULL = 'Coque rigide',
    SEA_SCOOTER = 'Scooter de mer',
    SEMI_RIGID = 'Semi-rigide',
    SUPPORT_SHIP = 'Bâtiment de soutien',
    TRAINING_SHIP = 'Bâtiment-école',
    TUGBOAT = 'Remorqueur'
  }

  // List of PAM units identifiers
  // 10141 PAM Gyptis
  // 10404 PAM Iris
  // 10121 PAM Jeanne Barret
  // 10345 PAM Osiris
  // 10080 PAM Themis
  export const PAMControlUnitIds = [10141, 10404, 10121, 10345, 10080]

  // ---------------------------------------------------------------------------
  // Types

  export type ControlUnitData = Omit<
    ControlUnit,
    | 'administration'
    | 'controlUnitContactIds'
    | 'controlUnitContacts'
    | 'controlUnitResourceIds'
    | 'controlUnitResources'
    | 'departmentArea'
  >
  export type NewControlUnitData = Omit<ControlUnitData, 'id'>

  export type ControlUnitContactData = Omit<ControlUnitContact, 'controlUnit'>
  export type NewControlUnitContactData = Omit<ControlUnitContactData, 'id'>

  export type ControlUnitResourceData = Omit<ControlUnitResource, 'base' | 'controlUnit'>
  export type NewControlUnitResourceData = Omit<ControlUnitResourceData, 'id'>
}
