import type { TargetTypeEnum } from './targetType'

export type Reporting = {
  actionTaken?: string
  controlUnitId?: number
  createdAt: Date
  description?: string
  geom: Record<string, any>[]
  id?: number
  isControlRequired?: boolean | undefined
  isInfractionProven?: boolean | undefined
  reportType: ReportingTypeEnum
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
  INFRACTION = 'INFRACTION_SUSPICION',
  OBSERVATION = 'OBSERVATION'
}

export const reportingTypeLabels = {
  INFRACTION: {
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
