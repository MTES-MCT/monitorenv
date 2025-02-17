import { Layers } from 'domain/entities/layers/constants'
import { reduce } from 'lodash-es'

import { getSemaphoreZoneFeature } from './semaphoresGeometryHelpers'

import type { EntityState } from '@reduxjs/toolkit'
import type { Reporting } from 'domain/entities/reporting'
import type { Semaphore } from 'domain/entities/semaphore'
import type { Feature } from 'ol'

export function getReportingsBySemaphoreId(reportings: (Reporting | undefined)[]) {
  return reportings.reduce((reportingsBySemaphore, reporting) => {
    const newReportingsBySemaphore = reportingsBySemaphore
    reporting?.reportingSources.forEach(({ semaphoreId }) => {
      if (semaphoreId) {
        if (!newReportingsBySemaphore[semaphoreId]) {
          newReportingsBySemaphore[semaphoreId] = []
        }
        newReportingsBySemaphore[semaphoreId].push(reporting)
      }
    })

    return newReportingsBySemaphore
  }, {} as Record<string, Reporting[]>)
}

export function getSemaphoresPoint(
  semaphores: EntityState<Semaphore, number> | undefined,
  reportings: (Reporting | undefined)[]
) {
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
