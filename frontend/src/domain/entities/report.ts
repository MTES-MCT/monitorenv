import type { TargetTypeEnum } from './targetType'

export type Report = {
  actions?: string
  description?: string
  geom?: Record<string, any>[]
  infractionProven?: boolean | undefined
  needControl: boolean
  reportTargetType?: TargetTypeEnum
  reportType: string
  semaphoreName?: string
  source: string
  targetDetails?: string
  themes: ReportTheme[]
  validity?: Date
  vehicleType?: string
}

export type ReportTheme = {
  subThemes?: string[]
  theme: string
}

export enum ReportSourceEnum {
  OTHER = 'OTHER',
  SEMAPHORE = 'SEMAPHORE',
  UNIT = 'UNIT'
}
export const reportSourceLabels = {
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

export enum ReportTypeEnum {
  INFRACTION = 'INFRACTION',
  OBSERVATION = 'OBSERVATION'
}

export const reportTypeLabels = {
  INFRACTION: {
    label: 'Infraction (suspicion)',
    value: 'INFRACTION'
  },
  OBSERVATION: {
    label: 'Observation',
    value: 'OBSERVATION'
  }
}

export enum InfractionProvenEnum {
  NOT_PROVEN = 'Non avérée',
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
