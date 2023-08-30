import { ReportingSourceEnum, type Reporting } from '../../domain/entities/reporting'

export function getReportingInitialValues(reporting?: Partial<Reporting | undefined>) {
  return {
    createdAt: new Date().toISOString(),
    geom: undefined,
    sourceType: ReportingSourceEnum.SEMAPHORE,
    validityTime: 24,
    ...reporting
  }
}
