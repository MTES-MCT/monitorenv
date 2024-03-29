import { THEME, customDayjs } from '@mtes-mct/monitor-ui'

import type { ControlPlansData } from './controlPlan'
import type { LegacyControlUnit } from './legacyControlUnit'
import type { ReportingDetailed } from './reporting'
import type { SeaFrontEnum } from './seaFrontType'
import type { FishMissionAction } from '@features/missions/fishActions.types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export enum ActionTypeEnum {
  CONTROL = 'CONTROL',
  DETACHED_REPORTING = 'DETACHED_REPORTING',
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

export const vesselTypeLabel: Record<VesselTypeEnum, string> = {
  COMMERCIAL: 'Commerce',
  FISHING: 'Pêche',
  MOTOR: 'Moteur',
  SAILING: 'Voilier'
}

export enum MissionStatusEnum {
  CLOSED = 'CLOSED',
  ENDED = 'ENDED',
  PENDING = 'PENDING',
  UPCOMING = 'UPCOMING'
}

export enum MissionStatusLabel {
  /* eslint-disable typescript-sort-keys/string-enum */
  UPCOMING = 'À venir',
  PENDING = 'En cours',
  ENDED = 'Terminée',
  CLOSED = 'Cloturée'
  /* eslint-disable typescript-sort-keys/string-enum */
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

export enum ActionSource {
  MONITORENV = 'MONITORENV',
  MONITORFISH = 'MONITORFISH'
}

// Mission from API
export type Mission<EnvAction = EnvActionControl | EnvActionSurveillance | EnvActionNote> = {
  attachedReportingIds: number[]
  attachedReportings: ReportingDetailed[]
  closedBy: string
  controlUnits: LegacyControlUnit[]
  createdAtUtc?: string | undefined
  detachedReportingIds: number[]
  detachedReportings?: []
  endDateTimeUtc?: string
  envActions: EnvAction[]
  facade: SeaFrontEnum
  fishActions: FishMissionAction.MissionAction[]
  geom?: GeoJSON.MultiPolygon
  hasMissionOrder?: boolean
  id: number
  isClosed: boolean
  isGeometryComputedFromControls: boolean
  isUnderJdp?: boolean
  missionSource: MissionSourceEnum
  missionTypes: MissionTypeEnum[]
  observationsCacem?: string
  observationsCnsp?: string
  openBy: string
  startDateTimeUtc: string
  updatedAtUtc?: string | undefined
}

export type NewMission = Omit<Mission<NewEnvAction>, 'controlUnits' | 'facade' | 'id'> & {
  controlUnits: Array<Omit<LegacyControlUnit, 'administrationId' | 'id'>>
  id: string
}
// Mission for API
export type MissionData = Omit<Partial<Mission<EnvAction>>, 'attachedReportings'>

export type EnvAction = EnvActionControl | EnvActionSurveillance | EnvActionNote
export type NewEnvAction = NewEnvActionControl | EnvActionSurveillance | EnvActionNote

export type EnvActionCommonProperties = {
  actionStartDateTimeUtc?: string | null
  id: string
}

export type NewEnvActionControl = EnvActionCommonProperties & {
  actionEndDateTimeUtc?: string | null
  actionNumberOfControls?: number
  actionTargetType?: string
  actionType: ActionTypeEnum.CONTROL
  controlPlans: ControlPlansData[]
  geom?: GeoJSON.MultiPolygon | GeoJSON.MultiPoint
  infractions: Infraction[] | NewInfraction[]
  isAdministrativeControl?: boolean
  isComplianceWithWaterRegulationsControl?: boolean
  isSafetyEquipmentAndStandardsComplianceControl?: boolean
  isSeafarersControl?: boolean
  observations: string | null
  reportingIds: number[]
  vehicleType?: string
}
export type EnvActionControl = NewEnvActionControl & {
  actionTargetType: string
}

export type EnvActionSurveillance = EnvActionCommonProperties & {
  actionEndDateTimeUtc?: string | null
  actionType: ActionTypeEnum.SURVEILLANCE
  controlPlans: ControlPlansData[]
  durationMatchesMission?: boolean
  geom?: GeoJSON.MultiPolygon
  observations: string | null
  reportingIds: number[]
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
  vesselSize?: Number | null
  vesselType?: VesselTypeEnum | null
}
export type Infraction = NewInfraction & {
  formalNotice: FormalNoticeEnum
  infractionType: InfractionTypeEnum
}

export type EnvActionForTimeline = Partial<EnvAction> & {
  actionSource: string
  formattedReportingId: string
  formattedReportingIds: string[]
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
