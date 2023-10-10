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
    /** `departmentAreaInseeDep` is the `departmentArea` ID. */
    departmentAreaInseeDep: string | undefined
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
    OFFICE = 'Bureau',
    ONBOARD_PHONE = 'Téléphone de bord',
    ON_CALL = 'Permanence',
    SEA = 'Mer',
    SECRETARIAT = 'Secrétariat',
    SERVICE_CHIEF = 'Chef de service',
    UNIT_CHIEF = 'Chef d’unité',
    UNKNOWN = 'Nom de contact non renseigné'
  }

  // Don't forget to mirror any update here in the backend enum.
  export enum ControlUnitResourceType {
    AIRPLANE = 'Avion',
    BARGE = 'Barge',
    CANOE = 'Canoë',
    CAR = 'Voiture',
    DRONE = 'Drône',
    EQUESTRIAN = 'Équestre',
    FAST_BOAT = 'Vedette',
    FRIGATE = 'Frégate',
    HELICOPTER = 'Hélicoptère',
    HYDROGRAPHIC_SHIP = 'Bâtiment hydrographique',
    JET_SKI = 'Jet-ski',
    KAYAK = 'Kayak',
    LIGHT_FAST_BOAT = 'Vedette légère',
    MINE_DIVER = 'Plongeur démineur',
    MOTORCYCLE = 'Moto',
    NET_LIFTER = 'Remonte-filets',
    PATROL_BOAT = 'Patrouilleur',
    PEDESTRIAN = 'Piéton',
    PIROGUE = 'Pirogue',
    RESEARCH_SHIP = 'Navire de recherche',
    RIGID_HULL = 'Coque rigide',
    SEA_SCOOTER = 'Scooter de mer',
    SEMI_RIGID = 'Semi-rigide',
    SUPPORT_SHIP = 'Bâtiment de soutien',
    TRAINING_SHIP = 'Bâtiment-école',
    TUGBOAT = 'Remorqueur',
    UNKNOWN = 'Type non renseigné'
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
    | 'departmentArea'
  >
  export type NewControlUnitData = Omit<ControlUnitData, 'id'>

  export type ControlUnitContactData = Omit<ControlUnitContact, 'controlUnit'>
  export type NewControlUnitContactData = Omit<ControlUnitContactData, 'id'>

  export type ControlUnitResourceData = Omit<ControlUnitResource, 'base' | 'controlUnit'>
  export type NewControlUnitResourceData = Omit<ControlUnitResourceData, 'id'>
}
