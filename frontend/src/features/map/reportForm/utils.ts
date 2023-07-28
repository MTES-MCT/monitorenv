import type { Report } from '../../../domain/entities/report'

export function getReportingInitialValues(reporting?: Partial<Report | undefined>) {
  if (reporting) {
    return {
      createdAt: new Date(),
      geom: undefined,
      sourceType: undefined,
      ...reporting
    }
  }

  return { createdAt: new Date(), geom: undefined, sourceType: undefined }
}
