
import GeoJSON from 'ol/format/GeoJSON'
import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
// import MultiPolygon from 'ol/geom/MultiPolygon'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../domain/entities/map'

export const getMissionCentroid = (mission) => {
  const geoJSON = new GeoJSON()
  const {geom} = mission
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const center = getCenter(geometry?.getExtent())
  const pointFeature =  new Feature({
    geometry: new Point(center)
  })
  pointFeature.setId(`mission:${mission.id}`)
  pointFeature.setProperties({missionId: mission.id})
  return  pointFeature
}

export const getMissionZoneFeature = (mission) => {
  const geoJSON = new GeoJSON()
  const {geom} = mission
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const feature =  new Feature({
    geometry
  })
  feature.setId(`mission:${mission.id}`)
  feature.setProperties({missionId: mission.id})
  return  feature
}