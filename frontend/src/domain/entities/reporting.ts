/* eslint-disable typescript-sort-keys/string-enum */
import { getTimeLeft } from '@features/Reportings/utils'
import { customDayjs as dayjs } from '@mtes-mct/monitor-ui'

import type { ActionSource, ActionTypeEnum, Mission } from './missions'
import type { TagFromAPI } from './tags'
import type { ReportingTargetTypeEnum } from './targetType'
import type { ThemeFromAPI } from './themes'
import type { VesselTypeEnum } from './vesselType'
import type { GeoJSON } from 'domain/types/GeoJSON'

export type Reporting = {
  actionTaken: string | undefined
  attachedEnvActionId: string
  attachedMission: Mission | undefined
  attachedToMissionAtUtc: string | undefined
  controlStatus: ControlStatusEnum
  createdAt: string | undefined
  description: string | undefined
  detachedFromMissionAtUtc: string | undefined
  geom: GeoJSON.MultiPolygon | GeoJSON.MultiPoint | undefined
  hasNoUnitAvailable: boolean | undefined
  id: number | string
  isArchived: boolean
  isControlRequired: boolean | undefined
  isInfractionProven: boolean
  missionId: number | undefined
  openBy: string
  reportType: ReportingTypeEnum
  reportingId: number | undefined
  reportingSources: ReportingSource[]
  subThemeIds: number[]
  tags: TagFromAPI[]
  targetDetails: TargetDetails[]
  targetType: ReportingTargetTypeEnum
  theme: ThemeFromAPI
  themeId: number
  updatedAtUtc: string | undefined
  validityTime: number
  vehicleType: string | undefined
  withVHFAnswer: boolean | undefined
}

export type ReportingSource = {
  controlUnitId?: number
  displayedSource?: string
  id?: string
  reportingId?: number
  semaphoreId?: number
  sourceName?: string
  sourceType: ReportingSourceEnum
}

export type DetachedReporting = {
  attachedToMissionAtUtc?: string
  detachedFromMissionAtUtc?: string
  id: number
  missionId: number
  reportingId: number
}

export enum InfractionProvenEnum {
  NOT_PROVEN = 'NOT_PROVEN',
  PROVEN = 'PROVEN'
}

export const InfractionProvenLabels = {
  PROVEN: {
    label: 'avéré',
    value: true
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  NOT_PROVEN: {
    label: 'non avéré',
    value: false
  }
}

export enum ControlStatusEnum {
  CONTROL_TO_BE_DONE = 'CONTROL_TO_BE_DONE',
  CONTROL_DONE = 'CONTROL_DONE',
  SURVEILLANCE_DONE = 'SURVEILLANCE_DONE'
}

export enum ControlStatusLabels {
  CONTROL_TO_BE_DONE = 'Ctl à faire',
  CONTROL_DONE = 'Ctl fait',
  SURVEILLANCE_DONE = 'Srv faite'
}

export type TargetDetails = {
  externalReferenceNumber?: string
  imo?: string
  mmsi?: string
  operatorName?: string
  size?: number
  vesselName?: string
  vesselType?: VesselTypeEnum
}

export type ReportingForTimeline = Partial<Reporting> & {
  actionSource: ActionSource
  actionType: ActionTypeEnum.REPORTING
  timelineDate: string
}

export type DetachedReportingForTimeline = DetachedReporting & {
  action: string
  actionSource: ActionSource
  actionType: ActionTypeEnum.DETACHED_REPORTING
  timelineDate: string
}

export enum ReportingSourceEnum {
  CONTROL_UNIT = 'CONTROL_UNIT',
  OTHER = 'OTHER',
  SEMAPHORE = 'SEMAPHORE'
}
export enum ReportingSourceLabels {
  SEMAPHORE = 'Sémaphore',
  CONTROL_UNIT = 'Unité',
  OTHER = 'Autre'
}

export enum ReportingTypeEnum {
  INFRACTION_SUSPICION = 'INFRACTION_SUSPICION',
  OBSERVATION = 'OBSERVATION'
}

export enum ReportingTypeLabels {
  INFRACTION_SUSPICION = 'Infraction (susp.)',
  OBSERVATION = 'Observation'
}

export enum ReportingStatusEnum {
  ARCHIVED = 'ARCHIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  // eslint-disable-next-line typescript-sort-keys/string-enum
  INFRACTION_SUSPICION = 'INFRACTION_SUSPICION',
  OBSERVATION = 'OBSERVATION',
  // eslint-disable-next-line typescript-sort-keys/string-enum
  ATTACHED_TO_MISSION = 'ATTACHED_TO_MISSION'
}

export enum StatusFilterEnum {
  ARCHIVED = 'ARCHIVED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export enum StatusFilterLabels {
  IN_PROGRESS = 'En cours',
  ARCHIVED = 'Archivés'
}

export enum AttachToMissionFilterEnum {
  ATTACHED = 'ATTACHED',
  UNATTACHED = 'UNATTACHED'
}

export enum AttachToMissionFilterLabels {
  ATTACHED = 'Liés à une mission',
  UNATTACHED = 'Non liés'
}

export const INDIVIDUAL_ANCHORING_THEME_ID = 100 // for 2024

export const getReportingStatus = ({
  createdAt,
  isArchived,
  reportType,
  validityTime
}: {
  createdAt?: string | undefined
  isArchived?: boolean
  reportType?: ReportingTypeEnum
  validityTime?: number | undefined
}): ReportingStatusEnum => {
  const endOfValidity = dayjs(createdAt)
    .add(validityTime ?? 0, 'hour')
    .toISOString()
  const timeLeft = getTimeLeft(endOfValidity)

  if (timeLeft < 0 || isArchived) {
    return ReportingStatusEnum.ARCHIVED
  }

  if (reportType === ReportingTypeEnum.OBSERVATION) {
    return ReportingStatusEnum.OBSERVATION
  }
  if (reportType === ReportingTypeEnum.INFRACTION_SUSPICION) {
    return ReportingStatusEnum.INFRACTION_SUSPICION
  }

  return ReportingStatusEnum.IN_PROGRESS
}

export type SuspicionOfOffense = {
  amount: number
  themes: string[]
}
