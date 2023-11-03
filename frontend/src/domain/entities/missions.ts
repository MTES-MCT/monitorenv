import { THEME, customDayjs } from '@mtes-mct/monitor-ui'

import type { LegacyControlUnit } from './legacyControlUnit'
import type { Reporting } from './reporting'
import type { SeaFrontEnum } from './seaFrontType'

export enum ActionTypeEnum {
  CONTROL = 'CONTROL',
  NOTE = 'NOTE',
  REPORTING = 'REPORTING',
  SURVEILLANCE = 'SURVEILLANCE'
}
export const actionTypeLabels = {
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

export enum MissionTypeEnum {
  AIR = 'AIR',
  LAND = 'LAND',
  SEA = 'SEA'
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

export enum MissionTypeLabel {
  AIR = 'Air',
  LAND = 'Terre',
  SEA = 'Mer'
}

export enum InfractionTypeEnum {
  WAITING = 'WAITING',
  WITHOUT_REPORT = 'WITHOUT_REPORT',
  WITH_REPORT = 'WITH_REPORT'
}
export const infractionTypeLabels = {
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

export enum FormalNoticeEnum {
  NO = 'NO',
  PENDING = 'PENDING',
  YES = 'YES'
}
export const formalNoticeLabels = {
  YES: {
    code: 'YES',
    libelle: 'Oui'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  NO: {
    code: 'NO',
    libelle: 'Non'
  },
  PENDING: {
    code: 'PENDING',
    libelle: 'En attente'
  }
}

export const hasMissionOrderLabels = {
  YES: {
    label: 'Oui',
    value: true
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  NO: {
    label: 'Non',
    value: false
  }
}

export enum VesselTypeEnum {
  COMMERCIAL = 'COMMERCIAL',
  FISHING = 'FISHING',
  MOTOR = 'MOTOR',
  SAILING = 'SAILING'
}
export const vesselTypeLabels = {
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

export enum VesselSizeEnum {
  FROM_12_TO_24m = 'FROM_12_TO_24m',
  FROM_24_TO_46m = 'FROM_24_TO_46m',
  LESS_THAN_12m = 'LESS_THAN_12m',
  MORE_THAN_46m = 'MORE_THAN_46m'
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
    label: 'Oiseaux',
    value: 'BIRDS'
  },
  FLORA: {
    label: 'Flore',
    value: 'FLORA'
  },
  HABITAT: {
    label: 'Habitat',
    value: 'HABITAT'
  },
  MARINE_MAMMALS: {
    label: 'Mammifères marins',
    value: 'MARINE_MAMMALS'
  },
  OTHER: {
    label: 'Autres espèces protégées',
    value: 'OTHER'
  },
  REPTILES: {
    label: 'Reptiles',
    value: 'REPTILES'
  }
}

export enum MissionStatusEnum {
  CLOSED = 'CLOSED',
  ENDED = 'ENDED',
  PENDING = 'PENDING',
  UPCOMING = 'UPCOMING'
}

export enum MissionStatusLabel {
  CLOSED = 'Cloturée',
  ENDED = 'Terminée',
  PENDING = 'En cours',
  UPCOMING = 'À venir'
}

export const missionStatusLabels = {
  CLOSED: {
    borderColor: THEME.color.slateGray,
    code: 'CLOSED',
    color: THEME.color.white,
    libelle: 'Cloturée'
  },
  ENDED: {
    code: 'ENDED',
    color: THEME.color.charcoal,
    libelle: 'Terminée'
  },
  PENDING: {
    code: 'PENDING',
    color: THEME.color.mediumSeaGreen,
    libelle: 'En cours'
  },
  UPCOMING: {
    code: 'UPCOMING',
    color: THEME.color.yellowGreen,
    libelle: 'À venir'
  }
}

export enum MissionSourceEnum {
  MONITORENV = 'MONITORENV',
  MONITORFISH = 'MONITORFISH',
  POSEIDON_CACEM = 'POSEIDON_CACEM',
  POSEIDON_CNSP = 'POSEIDON_CNSP'
}

export const missionSourceEnum = {
  MONITORENV: {
    label: 'CACEM',
    value: 'MONITORENV'
  },
  MONITORFISH: {
    label: 'CNSP',
    value: 'MONITORFISH'
  }
}

export enum MissionSourceLabel {
  MONITORENV = 'CACEM',
  MONITORFISH = 'CNSP'
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

export type Mission<EnvAction = EnvActionControl | EnvActionSurveillance | EnvActionNote> = {
  attachedReportingIds?: number[]
  attachedReportings?: Reporting[]
  closedBy: string
  controlUnits: LegacyControlUnit[]
  endDateTimeUtc?: string
  envActions: EnvAction[]
  facade: SeaFrontEnum
  geom?: Record<string, any>[]
  hasMissionOrder?: boolean
  id: number
  isClosed: boolean
  isUnderJdp?: boolean
  missionSource: MissionSourceEnum
  missionTypes: MissionTypeEnum[]
  observationsCacem?: string
  observationsCnsp?: string
  openBy: string
  startDateTimeUtc: string
}

export type NewMission = Omit<Mission, 'controlUnits' | 'facade' | 'id'> & {
  controlUnits: Array<Omit<LegacyControlUnit, 'administrationId' | 'id'>>
}

export type EnvAction = EnvActionControl | EnvActionSurveillance | EnvActionNote
export type NewEnvAction = NewEnvActionControl | EnvActionSurveillance | EnvActionNote

export type EnvActionCommonProperties = {
  actionEndDateTimeUtc?: string | null
  actionStartDateTimeUtc?: string | null
  geom?: Record<string, any>[]
  id: string
}

export type EnvActionTheme = {
  protectedSpecies?: string[]
  subThemes: string[]
  theme: string
}
export type NewEnvActionControl = EnvActionCommonProperties & {
  actionNumberOfControls?: number
  actionTargetType?: string
  actionType: ActionTypeEnum.CONTROL
  attachedReportingId?: number | undefined
  infractions: Infraction[]
  isAdministrativeControl?: boolean
  isComplianceWithWaterRegulationsControl?: boolean
  isSafetyEquipmentAndStandardsComplianceControl?: boolean
  isSeafarersControl?: boolean
  observations: string | null
  reportingIds?: number[]
  themes: EnvActionTheme[]
  vehicleType?: string
}
export type EnvActionControl = NewEnvActionControl & {
  actionTargetType: string
}

export type EnvActionSurveillance = EnvActionCommonProperties & {
  actionType: ActionTypeEnum.SURVEILLANCE
  attachedReportingId?: number | undefined
  coverMissionZone?: boolean
  durationMatchesMission?: boolean
  observations: string | null
  reportingIds?: number[]
  themes: EnvActionTheme[]
}

export type EnvActionNote = EnvActionCommonProperties & {
  actionType: ActionTypeEnum.NOTE
  observations?: string | null
}

export type NewInfraction = {
  companyName?: string | null
  controlledPersonIdentity?: string | null
  formalNotice?: FormalNoticeEnum
  id: string
  infractionType?: InfractionTypeEnum
  natinf?: string[]
  observations?: string | null
  registrationNumber?: string | null
  relevantCourt?: string | null
  toProcess: boolean
  vesselSize?: VesselSizeEnum | null
  vesselType?: VesselTypeEnum | null
}
export type Infraction = NewInfraction & {
  formalNotice: FormalNoticeEnum
  infractionType: InfractionTypeEnum
}

export type EnvActionForTimeline = Partial<EnvAction> & {
  formattedReportingId?: string
  timelineDate?: string
}

export const getMissionStatus = ({
  endDateTimeUtc,
  isClosed,
  startDateTimeUtc
}: {
  endDateTimeUtc?: string | null
  isClosed?: Boolean
  startDateTimeUtc?: string | null
}) => {
  if (!startDateTimeUtc) {
    return 'ERROR'
  }

  if (isClosed) {
    return MissionStatusEnum.CLOSED
  }

  const now = customDayjs()

  if (customDayjs(startDateTimeUtc).isAfter(now)) {
    return MissionStatusEnum.UPCOMING
  }

  if (endDateTimeUtc && customDayjs(endDateTimeUtc).isBefore(now)) {
    return MissionStatusEnum.ENDED
  }

  return MissionStatusEnum.PENDING
}

export const getTotalOfControls = (mission: Partial<Mission>) =>
  mission.envActions
    ?.map(control => (control.actionType === ActionTypeEnum.CONTROL && control.actionNumberOfControls) || 0)
    .reduce((acc, curr) => acc + curr, 0)

export const getTotalOfSurveillances = (mission: Partial<Mission>) =>
  mission.envActions?.filter(action => action.actionType === ActionTypeEnum.SURVEILLANCE).length
