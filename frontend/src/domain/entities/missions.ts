import { customDayjs, THEME } from '@mtes-mct/monitor-ui'

import type { LegacyControlUnit, LegacyControlUnitForm } from './legacyControlUnit'
import type { DetachedReportingForTimeline, Reporting, ReportingForTimeline } from './reporting'
import type { SeaFrontEnum } from './seaFrontType'
import type { TagFromAPI } from './tags'
import type { TargetTypeEnum } from './targetType'
import type { ThemeFromAPI } from './themes'
import type { VesselTypeEnum } from './vesselType'
import type { FishMissionAction } from '@features/Mission/fishActions.types'
import type { RapportNavMissionAction } from '@features/Mission/rapportNavActions.types'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const CIRCULAR_ZONE_RADIUS = 2000

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

export enum CompletionStatus {
  COMPLETED = 'COMPLETED',
  TO_COMPLETE = 'TO_COMPLETE'
}

export enum FrontCompletionStatus {
  COMPLETED = 'COMPLETED',
  TO_COMPLETE = 'TO_COMPLETE',
  TO_COMPLETE_MISSION_ENDED = 'TO_COMPLETE_MISSION_ENDED',
  UP_TO_DATE = 'UP_TO_DATE'
}

export enum FrontCompletionStatusLabel {
  COMPLETED = 'Complétées',
  TO_COMPLETE = 'À compléter',
  UP_TO_DATE = 'À jour'
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

export const infractionSeizureLabels = {
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
export enum InfractionSeizureEnum {
  NO = 'NO',
  PENDING = 'PENDING',
  YES = 'YES'
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
export type AdministrativeResponseType = 'SANCTION' | 'REGULARIZATION' | 'PENDING' | 'NONE'

export const administrativeResponseOptions: { label: string; value: AdministrativeResponseType }[] = [
  { label: 'Sanction', value: 'SANCTION' },
  { label: 'Régularisation', value: 'REGULARIZATION' },
  { label: 'Aucune', value: 'NONE' },
  { label: 'En attente', value: 'PENDING' }
]

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

export enum MissionStatusEnum {
  ENDED = 'ENDED',
  PENDING = 'PENDING',
  UPCOMING = 'UPCOMING'
}

export enum MissionStatusLabel {
  /* eslint-disable typescript-sort-keys/string-enum */
  UPCOMING = 'À venir',
  PENDING = 'En cours',
  ENDED = 'Terminée'
  /* eslint-disable typescript-sort-keys/string-enum */
}

export const missionStatusLabels = {
  ENDED: {
    code: 'ENDED',
    color: THEME.color.gunMetal,
    libelle: 'Terminée'
  },
  PENDING: {
    code: 'PENDING',
    color: THEME.color.blueGray,
    libelle: 'En cours'
  },
  UPCOMING: {
    code: 'UPCOMING',
    color: THEME.color.mayaBlue,
    libelle: 'À venir'
  }
}

export enum MissionSourceEnum {
  MONITORENV = 'MONITORENV',
  MONITORFISH = 'MONITORFISH',
  POSEIDON_CACEM = 'POSEIDON_CACEM',
  POSEIDON_CNSP = 'POSEIDON_CNSP',
  RAPPORT_NAV = 'RAPPORT_NAV'
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
  attachedReportings: Reporting[]
  completedBy: string | undefined
  controlUnits: LegacyControlUnit[]
  createdAtUtc?: string | undefined
  detachedReportingIds: number[]
  detachedReportings?: []
  endDateTimeUtc: string
  envActions: EnvAction[]
  facade: SeaFrontEnum
  fishActions: FishMissionAction.MissionAction[]
  geom?: GeoJSON.MultiPolygon
  hasMissionOrder?: boolean
  hasRapportNavActions: RapportNavMissionAction.MissionAction
  id: number
  isGeometryComputedFromControls: boolean
  isUnderJdp?: boolean
  missionSource: MissionSourceEnum
  missionTypes: MissionTypeEnum[]
  observationsCacem?: string
  observationsCnsp?: string
  openBy?: string
  startDateTimeUtc: string
  updatedAtUtc?: string | undefined
}

export type NewMission = Omit<Mission<NewEnvAction>, 'controlUnits' | 'facade' | 'id'> & {
  controlUnits: Array<Omit<LegacyControlUnitForm, 'administrationId' | 'id'>>
  id: string
}
// Mission for API
export type MissionData = Omit<Partial<Mission<EnvAction>>, 'attachedReportings'>

export type EnvAction = EnvActionControl | EnvActionSurveillance | EnvActionNote
export type NewEnvAction = NewEnvActionControl | EnvActionSurveillance | EnvActionNote

export type EnvActionCommonProperties = {
  actionStartDateTimeUtc?: string
  id: string
}

export type NewEnvActionControl = EnvActionCommonProperties & {
  actionEndDateTimeUtc?: string
  actionNumberOfControls?: number
  actionTargetType?: TargetTypeEnum
  actionType: ActionTypeEnum.CONTROL
  completedBy?: string
  completion: CompletionStatus
  geom?: GeoJSON.MultiPolygon | GeoJSON.MultiPoint
  infractions: Infraction[] | NewInfraction[]
  isAdministrativeControl?: boolean
  isComplianceWithWaterRegulationsControl?: boolean
  isSafetyEquipmentAndStandardsComplianceControl?: boolean
  isSeafarersControl?: boolean
  observations?: string
  openBy: string
  reportingIds: number[]
  tags?: TagFromAPI[]
  themes?: ThemeFromAPI[]
  vehicleType?: string
}
export type EnvActionControl = NewEnvActionControl & {
  actionTargetType: TargetTypeEnum
}

export type EnvActionSurveillance = EnvActionCommonProperties & {
  actionEndDateTimeUtc?: string
  actionType: ActionTypeEnum.SURVEILLANCE
  awareness?: Awareness
  completedBy?: string
  completion: CompletionStatus
  durationMatchesMission?: boolean
  geom?: GeoJSON.MultiPolygon
  observations?: string
  openBy: string
  reportingIds: number[]
  tags?: TagFromAPI[]
  themes?: ThemeFromAPI[]
}

export type Awareness = {
  details?: {
    nbPerson: number
    themeId: number
  }[]
  isRisingAwareness?: boolean
}

export type ControlOrSurveillance = EnvActionControl | NewEnvActionControl | EnvActionSurveillance

export type EnvActionNote = EnvActionCommonProperties & {
  actionType: ActionTypeEnum.NOTE
  observations?: string
}

export type NewInfraction = {
  administrativeResponse?: AdministrativeResponseType
  companyName?: string
  controlledPersonIdentity?: string
  formalNotice?: FormalNoticeEnum
  id: string
  imo?: string
  infractionType?: InfractionTypeEnum
  mmsi?: string
  natinf?: string[]
  nbTarget: number
  observations?: string
  registrationNumber?: string
  seizure?: InfractionSeizureEnum
  vesselName?: string
  vesselSize?: number
  vesselType?: VesselTypeEnum
}
export type Infraction = NewInfraction & {
  administrativeResponse: AdministrativeResponseType
  formalNotice: FormalNoticeEnum
  infractionType: InfractionTypeEnum
  nbTarget: number
  seizure: InfractionSeizureEnum
}

export type EnvActionForTimeline = EnvAction & {
  actionSource: ActionSource
  formattedReportingId: string
  formattedReportingIds: string[]
  timelineDate?: string
}

export type ActionsTypeForTimeLine =
  | ReportingForTimeline
  | DetachedReportingForTimeline
  | EnvActionForTimeline
  | FishMissionAction.FishActionForTimeline

export const getMissionStatus = ({
  endDateTimeUtc,
  startDateTimeUtc
}: {
  endDateTimeUtc?: string
  startDateTimeUtc?: string
}) => {
  if (!startDateTimeUtc) {
    return 'ERROR'
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
