import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'
// import MultiPolygon from 'ol/geom/MultiPolygon'

import { Layers } from '../../../domain/entities/layers'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'

export const getMissionCentroid = (mission, layername) => {
  const geoJSON = new GeoJSON()
  const { geom } = mission
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const center = getCenter(geometry?.getExtent())
  const pointFeature = new Feature({
    geometry: new Point(center)
  })
  pointFeature.setId(`${layername}:${mission.id}`)
  pointFeature.setProperties({
    inputEndDatetimeUtc: mission.inputEndDatetimeUtc,
    inputStartDatetimeUtc: mission.inputStartDatetimeUtc,
    missionId: mission.id,
    missionStatus: mission.missionStatus,
    missionType: mission.missionType,
    numberOfActions: mission.actions?.length || 0,
    resourceUnits: mission.resourceUnits
  })

  return pointFeature
}

export const getMissionZoneFeature = (mission, layername) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(mission.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const feature = new Feature({
    geometry
  })
  feature.setId(`${layername}:${mission.id}`)
  feature.setProperties({
    envActions: mission.envActions,
    inputEndDatetimeUtc: mission.inputEndDatetimeUtc,
    inputStartDatetimeUtc: mission.inputStartDatetimeUtc,
    missionId: mission.id,
    missionStatus: mission.missionStatus,
    missionType: mission.missionType,
    numberOfActions: mission.actions?.length || 0,
    resourceUnits: mission.resourceUnits
  })

  return feature
}

const getActionFeature = action => {
  const geoJSON = new GeoJSON()
  const {
    actionNumberOfControls,
    actionStartDatetimeUtc,
    actionSubTheme,
    actionTargetType,
    actionTheme,
    actionType,
    geom,
    infractions
  } = action
  if (!geom) {
    return null
  }
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const feature = new Feature({
    geometry
  })
  feature.setId(`${Layers.ACTIONS.code}:${action.id}`)
  feature.setProperties({
    actionNumberOfControls,
    actionStartDatetimeUtc,
    actionSubTheme,
    actionTargetType,
    actionTheme,
    actionType,
    infractions
  })

  return feature
}

export const getActionsFeatures = mission => {
  const { envActions } = mission
  if (envActions?.length > 0) {
    return envActions.map(getActionFeature).filter(f => f)
  }

  return []
}
