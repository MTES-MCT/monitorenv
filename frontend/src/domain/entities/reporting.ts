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
  reportType: string
  semaphoreId?: number
  sourceName?: string
  sourceType: string
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
  OTHER = 'OTHER',
  SEMAPHORE = 'SEMAPHORE',
  UNIT = 'UNIT'
}
export const reportingSourceLabels = {
  SEMAPHORE: {
    label: 'Sémaphore',
    value: 'SEMAPHORE'
  },
  UNIT: {
    label: 'Unité',
    value: 'UNIT'
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
    value: 'PROVEN'
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  NOT_PROVEN: {
    label: 'Non avérée',
    value: 'NOT_PROVEN'
  }
}
