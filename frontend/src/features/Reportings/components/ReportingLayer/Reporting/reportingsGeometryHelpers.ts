import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../../domain/entities/map/constants'

import type { ReportingDetailed } from '../../../../../domain/entities/reporting'
import type { AtLeast } from '../../../../../types'

export const getReportingZoneFeature = (
  reporting: ReportingDetailed | AtLeast<ReportingDetailed, 'id'>,
  layername: string
) => {
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
    ...reporting
  })

  return feature
}

export const getEditingReportingZoneFeature = (reporting: AtLeast<ReportingDetailed, 'id'>, layername: string) => {
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
    ...reporting
  })

  return feature
}
