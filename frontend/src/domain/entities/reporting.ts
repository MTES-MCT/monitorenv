/* eslint-disable typescript-sort-keys/string-enum */
import { customDayjs as dayjs } from '@mtes-mct/monitor-ui'

import type { ReportingTargetTypeEnum } from './targetType'

export type Reporting = {
  actionTaken?: string
  controlUnitId?: number
  createdAt: string
  description?: string
  geom: Record<string, any>[]
  id?: number
  isArchived?: boolean
  isControlRequired?: boolean | undefined
  openBy: string
  reportType: ReportingTypeEnum
  reportingId?: number
  semaphoreId?: number
  sourceName?: string
  sourceType: ReportingSourceEnum
  subThemes?: string[]
  targetDetails?: TargetDetails
  targetType?: ReportingTargetTypeEnum
  theme?: string
  validityTime?: number
  vehicleType?: string
}

export type ReportingDetailed = Reporting & {
  displayedSource: string
}

type TargetDetails = {
  externalReferenceNumber?: string
  imo?: string
  mmsi?: string
  operatorName?: string
  size?: number
  vesselName?: string
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
  INFRACTION_SUSPICION = 'Infraction (suspicion)',
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

export const getFormattedReportingId = (reportingId: number) =>
  `${String(reportingId).slice(0, 2)}-${String(reportingId).slice(2)}`

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
}) => {
  const endOfValidity = dayjs(createdAt)
    .add(validityTime || 0, 'hour')
    .toISOString()
  const timeLeft = dayjs(endOfValidity).diff(dayjs(), 'hour', true)

  if (timeLeft < 0 || isArchived) {
    return ReportingStatusEnum.ARCHIVED
  }

  if (reportType === ReportingTypeEnum.OBSERVATION) {
    return ReportingStatusEnum.OBSERVATION
  }
  if (reportType === ReportingTypeEnum.INFRACTION_SUSPICION) {
    // TODO handle attached to mission
    return ReportingStatusEnum.INFRACTION_SUSPICION
  }

  return ReportingStatusEnum.IN_PROGRESS
}
