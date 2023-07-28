import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'

import type { Reporting } from '../../../../domain/entities/reporting'

export const getReportingZoneFeature = (reporting: Reporting, layername: string) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(reporting.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  const feature = new Feature({
    geometry
  })
  feature.setId(`${layername}:${reporting.id}`)
  feature.setProperties({
    actionTaken: reporting.actionTaken,
    controlUnitId: reporting.controlUnitId,
    createdAt: reporting.createdAt,
    description: reporting.description,
    geom: reporting.geom,
    id: reporting.id,
    isArchived: reporting.isArchived,
    isInfractionProven: reporting.isInfractionProven,
    reportingId: reporting.reportingId,
    reportType: reporting.reportType,
    semaphoreId: reporting.semaphoreId,
    sourceName: reporting.sourceName,
    subThemes: reporting.subThemes,
    theme: reporting.theme,
    validityTime: reporting.validityTime
  })

  return feature
}
