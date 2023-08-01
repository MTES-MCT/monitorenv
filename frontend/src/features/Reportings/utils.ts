import { customDayjs as dayjs } from '@mtes-mct/monitor-ui'

import {
  ReportingSourceEnum,
  type Reporting,
  ReportingTypeEnum,
  ReportingStatusEnum
} from '../../domain/entities/reporting'

export function getReportingInitialValues(reporting?: Partial<Reporting | undefined>) {
  if (reporting) {
    return {
      createdAt: new Date().toISOString(),
      geom: undefined,
      sourceType: ReportingSourceEnum.SEMAPHORE,
      validityTime: 24,
      ...reporting
    }
  }

  return {
    createdAt: new Date().toISOString(),
    geom: undefined,
    sourceType: ReportingSourceEnum.SEMAPHORE,
    validityTime: 24
  }
}

export function getReportingEndOfValidity(createdAt, validityTime) {
  return dayjs(createdAt).add(validityTime || 0, 'hour')
}

export function getReportingTimeLeft(createdAt, validityTime) {
  const endOfValidity = dayjs(createdAt).add(validityTime || 0, 'hour')

  return dayjs(endOfValidity).diff(dayjs().toISOString(), 'hour', true)
}

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
  const timeLeft = getReportingTimeLeft(createdAt, validityTime)

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
