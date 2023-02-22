import { compareDesc, compareAsc, parseISO } from 'date-fns'

import type { ControlUnit } from './controlUnit'

export const actionTypeEnum = {
  CONTROL: {
    code: 'CONTROL',
    libelle: 'Contrôle'
  },
  NOTE: {
    code: 'NOTE',
    libelle: 'Note'
  },
  SURVEILLANCE: {
    code: 'SURVEILLANCE',
    libelle: 'Surveillance'
  }
}
export enum ActionTypeEnum {
  CONTROL = 'CONTROL',
  NOTE = 'NOTE',
  SURVEILLANCE = 'SURVEILLANCE'
}

export const missionTypeEnum = {
  SEA: {
    code: 'SEA',
    libelle: 'Mer'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  LAND: {
    code: 'LAND',
    libelle: 'Terre'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  AIR: {
    code: 'AIR',
    libelle: 'Air'
  }
}
export enum MissionTypeEnum {
  AIR = 'AIR',
  LAND = 'LAND',
  SEA = 'SEA'
}

export const missionNatureEnum = {
  ENV: {
    code: 'ENV',
    libelle: 'Env'
  },
  FISH: {
    code: 'FISH',
    libelle: 'Pêche'
  },
  OTHER: {
    code: 'OTHER',
    libelle: 'Autre'
  }
}
export enum MissionNatureEnum {
  ENV = 'ENV',
  FISH = 'FISH',
  OTHER = 'OTHER'
}

export const infractionTypeEnum = {
  WITH_REPORT: {
    code: 'WITH_REPORT',
    libelle: 'Avec PV'
  },
  WITHOUT_REPORT: {
    code: 'WITHOUT_REPORT',
    libelle: 'Sans PV'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  WAITING: {
    code: 'WAITING',
    libelle: 'En attente'
  }
}

export enum InfractionTypeEnum {
  WAITING = 'WAITING',
  WITHOUT_REPORT = 'WITHOUT_REPORT',
  WITH_REPORT = 'WITH_REPORT'
}

export const formalNoticeEnum = {
  YES: {
    code: 'YES',
    libelle: 'Oui'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  NO: {
    code: 'NO',
    libelle: 'Non'
  },
  WAITING: {
    code: 'PENDING',
    libelle: 'En attente'
  }
}
export enum FormalNoticeEnum {
  NO = 'NO',
  WAITING = 'WAITING',
  YES = 'YES'
}

export const actionTargetTypeEnum = {
  COMPANY: {
    code: 'COMPANY',
    libelle: 'Société'
  },
  INDIVIDUAL: {
    code: 'INDIVIDUAL',
    libelle: 'Personne physique'
  },
  VEHICLE: {
    code: 'VEHICLE',
    libelle: 'Véhicule'
  }
}

export const vehicleTypeEnum = {
  OTHER_SEA: {
    code: 'OTHER_SEA',
    libelle: 'Autre véhicule marin'
  },
  VEHICLE_AIR: {
    code: 'VEHICLE_AIR',
    libelle: 'Véhicule aérien'
  },
  VEHICLE_LAND: {
    code: 'VEHICLE_LAND',
    libelle: 'Véhicule terrestre'
  },
  VESSEL: {
    code: 'VESSEL',
    libelle: 'Navire'
  }
}

export const vesselTypeEnum = {
  COMMERCIAL: {
    code: 'COMMERCIAL',
    libelle: 'Commerce'
  },
  FISHING: {
    code: 'FISHING',
    libelle: 'Pêche'
  },
  MOTOR: {
    code: 'MOTOR',
    libelle: 'Moteur'
  },
  SAILING: {
    code: 'SAILING',
    libelle: 'Voilier'
  }
}
export enum VesselTypeEnum {
  COMMERCIAL = 'COMMERCIAL',
  FISHING = 'FISHING',
  MOTOR = 'MOTOR',
  SAILING = 'SAILING'
}

export const vesselSizeEnum = {
  FROM_12_TO_24m: {
    code: 'FROM_12_TO_24m',
    libelle: '12 à 24 m'
  },
  FROM_24_TO_46m: {
    code: 'FROM_24_TO_46m',
    libelle: 'plus de 24 m'
  },
  LESS_THAN_12m: {
    code: 'LESS_THAN_12m',
    libelle: 'moins de 12 m'
  },
  MORE_THAN_46m: {
    code: 'MORE_THAN_46m',
    libelle: 'plus de 46 m'
  }
}

export enum VesselSizeEnum {
  FROM_12_TO_24m = 'FROM_12_TO_24m',
  FROM_24_TO_46m = 'FROM_24_TO_46m',
  LESS_THAN_12m = 'LESS_THAN_12m',
  MORE_THAN_46m = 'MORE_THAN_46m'
}

export const protectedSpeciesEnum = {
  BIRDS: {
    code: 'BIRDS',
    libelle: 'Oiseaux'
  },
  FLORA: {
    code: 'FLORA',
    libelle: 'Flore'
  },
  HABITAT: {
    code: 'HABITAT',
    libelle: 'Habitat'
  },
  MARINE_MAMMALS: {
    code: 'MARINE_MAMMALS',
    libelle: 'Mammifères marins'
  },
  OTHER: {
    code: 'OTHER',
    libelle: 'Autres espèces protégées'
  },
  REPTILES: {
    code: 'REPTILES',
    libelle: 'Reptiles'
  }
}

export const missionStatusEnum = {
  CLOSED: {
    code: 'CLOSED',
    libelle: 'Cloturée'
  },
  ENDED: {
    code: 'ENDED',
    libelle: 'Terminée'
  },
  PENDING: {
    code: 'PENDING',
    libelle: 'En cours'
  },
  UPCOMING: {
    code: 'UPCOMING',
    libelle: 'À venir'
  }
}

export enum MissionSourceEnum {
  MONITORENV = 'MONITORENV',
  MONITORFISH = 'MONITORFISH',
  POSEIDON_CACEM = 'POSEIDON_CACEM',
  POSEIDON_CNSP = 'POSEIDON_CNSP'
}

export const THEME_REQUIRE_PROTECTED_SPECIES = ['Police des espèces protégées et de leurs habitats (faune et flore)']

export const relevantCourtEnum = {
  JULIS: {
    code: 'JULIS',
    libelle: 'Juridictions littorales spécialisées (JULIS)'
  },
  LOCAL_COURT: {
    code: 'LOCAL_COURT',
    libelle: 'Parquet Local'
  },
  MARITIME_COURT: {
    code: 'MARITIME_COURT',
    libelle: 'Tribunal maritime'
  },
  PRE: {
    code: 'PRE',
    libelle: 'Pôle Régional Environnemental (PRE)'
  }
}

export type ResourceUnit = {
  administration: string
}

export type MissionType<EnvActionType = EnvActionControlType | EnvActionSurveillanceType | EnvActionNoteType> = {
  closedBy: string
  controlUnits: ControlUnit[]
  endDateTimeUtc: string
  envActions: Array<EnvActionType>
  facade: string
  geom?: Record<string, any>[]
  id: number
  isClosed: boolean
  missionNature: MissionNatureEnum[]
  missionSource: MissionSourceEnum
  missionType: MissionTypeEnum
  observationsCacem: string
  observationsCnsp: string
  openBy: string
  startDateTimeUtc: string
}

export type NewMissionType = Omit<MissionType, 'id' | 'facade'>

export type EnvActionType = EnvActionControlType | EnvActionSurveillanceType | EnvActionNoteType

export type EnvActionCommonProperties = {
  actionStartDateTimeUtc?: string
  geom?: Record<string, any>[]
  id: string
}
export type EnvActionControlType = EnvActionCommonProperties & {
  actionNumberOfControls?: number
  actionSubTheme?: string
  actionTargetType?: string
  actionTheme?: string
  actionType: ActionTypeEnum.CONTROL
  infractions: InfractionType[]
  protectedSpecies?: string
  vehicleType: string
}

export type EnvActionSurveillanceType = EnvActionCommonProperties & {
  actionSubTheme?: string
  actionTheme?: string
  actionType: ActionTypeEnum.SURVEILLANCE
  coverMissionZone?: boolean
  duration: number
  observations: string
  protectedSpecies?: string
}

export type EnvActionNoteType = EnvActionCommonProperties & {
  actionType: ActionTypeEnum.NOTE
  observations?: string
}

export type InfractionType = {
  companyName?: string
  controlledPersonIdentity?: string
  formalNotice: FormalNoticeEnum
  id: string
  infractionType: InfractionTypeEnum
  natinf?: string[]
  observations?: string
  registrationNumber?: string
  relevantCourt?: string
  toProcess: boolean
  vesselSize?: VesselSizeEnum
  vesselType?: VesselTypeEnum
}

export const getMissionStatus = ({
  endDateTimeUtc,
  isClosed,
  startDateTimeUtc
}: {
  endDateTimeUtc?: string
  isClosed?: Boolean
  startDateTimeUtc?: string
}) => {
  if (isClosed) {
    return missionStatusEnum.CLOSED.code
  }
  if (startDateTimeUtc) {
    if (parseISO(startDateTimeUtc) && compareAsc(parseISO(startDateTimeUtc), Date.now()) >= 0) {
      return missionStatusEnum.UPCOMING.code
    }
    if (endDateTimeUtc && parseISO(endDateTimeUtc) && compareDesc(parseISO(endDateTimeUtc), Date.now()) >= 0) {
      return missionStatusEnum.ENDED.code
    }

    return missionStatusEnum.PENDING.code
  }

  return 'ERROR'
}
