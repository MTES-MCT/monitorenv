import type { Reporting } from '../../../domain/entities/reporting'

export function getReportingInitialValues(reporting?: Partial<Reporting | undefined>) {
  if (reporting) {
    return {
      createdAt: new Date().toISOString(),
      geom: undefined,
      sourceType: undefined,
      validityTime: 24,
      ...reporting
    }
  }

  return { createdAt: new Date().toISOString(), geom: undefined, sourceType: undefined, validityTime: 24 }
}
