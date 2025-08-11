import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

import type { AtLeast } from '../../../../../types'
import type { Reporting } from 'domain/entities/reporting'

export const getReportingZoneFeature = (reporting: Reporting | AtLeast<Reporting, 'id'>, layername: string) => {
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
    ...reporting,
    geom: null
  })

  return feature
}

export const getEditingReportingZoneFeature = (reporting: AtLeast<Reporting, 'id'>, layername: string) => {
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
    ...reporting,
    geom: null
  })

  return feature
}
