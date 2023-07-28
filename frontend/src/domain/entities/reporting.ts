import dayjs from 'dayjs'

import type { TargetTypeEnum } from './targetType'

export type Reporting = {
  actionTaken?: string
  controlUnitId?: number
  createdAt: string
  description?: string
  geom: Record<string, any>[]
  id?: number
  isArchived?: boolean
  isControlRequired?: boolean | undefined
  isInfractionProven?: boolean | undefined
  reportType: ReportingTypeEnum
  reportingId?: number
  semaphoreId?: number
  sourceName?: string
  sourceType: ReportingSourceEnum
  subThemes?: string[]
  targetDetails?: TargetDetails
  targetType?: TargetTypeEnum
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
export const reportingSourceLabels = {
  SEMAPHORE: {
    label: 'Sémaphore',
    value: 'SEMAPHORE'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  CONTROL_UNIT: {
    label: 'Unité',
    value: 'CONTROL_UNIT'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  OTHER: {
    label: 'Autre',
    value: 'OTHER'
  }
}

export enum ReportingTypeEnum {
  INFRACTION_SUSPICION = 'INFRACTION_SUSPICION',
  OBSERVATION = 'OBSERVATION'
}

export const reportingTypeLabels = {
  INFRACTION_SUSPICION: {
    label: 'Infraction (suspicion)',
    value: 'INFRACTION_SUSPICION'
  },
  OBSERVATION: {
    label: 'Observation',
    value: 'OBSERVATION'
  }
}

export enum InfractionProvenEnum {
  NOT_PROVEN = 'NOT_PROVEN',
  PROVEN = 'PROVEN'
}

export const infractionProvenLabels = {
  PROVEN: {
    label: 'Avérée',
    value: true
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  NOT_PROVEN: {
    label: 'Non avérée',
    value: false
  }
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

export const getFormattedReportingId = (reportingId: number) =>
  `${String(reportingId).slice(0, 2)}-${String(reportingId).slice(2)}`

export const getReportingStatus = ({
  createdAt,
  isArchived,
  isInfractionProven,
  reportType,
  validityTime
}: {
  createdAt?: string | undefined
  isArchived?: boolean
  isInfractionProven?: boolean
  reportType?: ReportingTypeEnum
  validityTime?: number | undefined
}) => {
  const endOfValidity = dayjs(createdAt)
    .add(validityTime || 0, 'hour')
    .toISOString()
  const timeLeft = dayjs(endOfValidity).diff(dayjs(), 'hour')

  if (timeLeft < 0 || isArchived) {
    return ReportingStatusEnum.ARCHIVED
  }

  if (isInfractionProven) {
    if (reportType === ReportingTypeEnum.OBSERVATION) {
      return ReportingStatusEnum.OBSERVATION
    }
    if (reportType === ReportingTypeEnum.INFRACTION_SUSPICION) {
      // TODO handle attached to mission
      return ReportingStatusEnum.INFRACTION_SUSPICION
    }
  }

  return ReportingStatusEnum.IN_PROGRESS
}
