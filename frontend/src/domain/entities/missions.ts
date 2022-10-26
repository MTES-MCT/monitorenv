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
  }
}

export const formalNoticeEnum = {
  NO: {
    code: 'NO',
    libelle: 'Non'
  },
  WAITING: {
    code: 'PENDING',
    libelle: 'En attente'
  },
  YES: {
    code: 'YES',
    libelle: 'Oui'
  }
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
  }
}
export enum MissionStatusEnum {
  CLOSED = 'CLOSED',
  ENDED = 'ENDED',
  PENDING = 'PENDING'
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

export type MissionType<MissionSubType = MissionControlType | MissionSurveillanceType | MissionObservationType> = {
  closedBy: string
  envActions: Array<MissionSubType>
  facade: string
  geom: string
  id: number
  inputEndDatetimeUtc: string
  inputStartDatetimeUtc: string
  missionNature: MissionNatureEnum
  missionStatus: MissionStatusEnum
  missionType: MissionTypeEnum
  observations: string
  openBy: string
  resourceUnits: string
}

export type EnvAction = {
  actionStartDatetimeUtc: string
  actionType: ActionTypeEnum
  geom: string
  id: string
}
export type MissionControlType = {
  actionTheme: string
  protectedSpecies: string
}
export type MissionSurveillanceType = {}
export type MissionObservationType = {}
