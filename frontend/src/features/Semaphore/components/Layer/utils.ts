import { Layers } from 'domain/entities/layers/constants'
import { cloneDeep, reduce } from 'lodash'

import { getSemaphoreZoneFeature } from './semaphoresGeometryHelpers'

import type { Feature } from 'ol'

export function getReportingsBySemaphoreId(reportings) {
  return reduce(
    reportings,
    (reportingsBySemaphore, reporting) => {
      const reports = cloneDeep(reportingsBySemaphore)
      if (reporting && reporting.semaphoreId) {
        if (!reports[reporting.semaphoreId]) {
          reports[reporting.semaphoreId] = [reporting]
        } else {
          reports[reporting.semaphoreId].push(reporting)
        }
      }

      return reports
    },
    {} as Record<string, any>
  )
}

export function getSemaphoresPoint(semaphores, reportings) {
  const reportingsBySemaphoreId = getReportingsBySemaphoreId(reportings)

  return reduce(
    semaphores?.entities,
    (features, semaphore) => {
      if (semaphore && semaphore.geom) {
        const semaphoreFeature = getSemaphoreZoneFeature(semaphore, Layers.SEMAPHORES.code)
        semaphoreFeature.setProperties({
          reportingsAttachedToSemaphore: reportingsBySemaphoreId[semaphore.id]
        })
        features.push(semaphoreFeature)
      }

      return features
    },
    [] as Feature[]
  )
}
