
import GeoJSON from 'ol/format/GeoJSON'
import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
// import MultiPolygon from 'ol/geom/MultiPolygon'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'
import Layers from '../../../domain/entities/layers'

export const getMissionCentroid = (mission, layername) => {
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
  pointFeature.setId(`${layername}:${mission.id}`)
  pointFeature.setProperties({
    missionId: mission.id, 
    inputStartDatetimeUtc: mission.inputStartDatetimeUtc, 
    inputEndDatetimeUtc: mission.inputEndDatetimeUtc,
    missionType: mission.missionType,
    resourceUnits: mission.resourceUnits,
    numberOfActions: mission.actions?.length || 0,
    missionStatus: mission.missionStatus
  })
  return  pointFeature
}

export const getMissionZoneFeature = (mission, layername) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(mission.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const feature =  new Feature({
    geometry
  })
  feature.setId(`${layername}:${mission.id}`)
  feature.setProperties({
    missionId: mission.id, 
    inputStartDatetimeUtc: mission.inputStartDatetimeUtc, 
    inputEndDatetimeUtc: mission.inputEndDatetimeUtc,
    missionType: mission.missionType,
    resourceUnits: mission.resourceUnits,
    numberOfActions: mission.actions?.length || 0,
    missionStatus: mission.missionStatus
  })
  return  feature
}


const getActionFeature = (action) => {
  const geoJSON = new GeoJSON()
  const {
    geom, 
    actionType, 
    actionNumberOfControls, 
    actionTheme, 
    actionStartDatetimeUtc, 
    infractions
  } = action
  if (!geom) {
    return null
  }
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const feature =  new Feature({
    geometry
  })
  feature.setId(`${Layers.ACTIONS.code}:${action.id}`)
  feature.setProperties({
    actionType,
    actionTheme,
    actionStartDatetimeUtc,
    actionNumberOfControls,
    infractions
  })
  return  feature
}

export const getActionsFeatures = (mission) => {
  const { actions } = mission
  if (actions?.length > 0) {
    return actions.map(getActionFeature).filter(f=>f)
  }
  return []
}