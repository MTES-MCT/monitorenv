import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'

import { Layers } from '../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map/constants'
import {
  ActionTypeEnum,
  EnvActionControlType,
  EnvActionSurveillanceType,
  getMissionStatus,
  MissionType
} from '../../../domain/entities/missions'

import type { Geometry } from 'ol/geom'

export const getMissionCentroid = (mission: Partial<MissionType>, layername: string) => {
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
    controlUnits: mission.controlUnits,
    endDateTimeUtc: mission.endDateTimeUtc,
    missionId: mission.id,
    missionStatus: getMissionStatus(mission),
    missionType: mission.missionType,
    numberOfActions: mission.envActions?.length || 0,
    startDateTimeUtc: mission.startDateTimeUtc
  })

  return pointFeature
}

export const getMissionZoneFeature = (mission: Partial<MissionType>, layername: string) => {
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
    controlUnits: mission.controlUnits,
    endDateTimeUtc: mission.endDateTimeUtc,
    envActions: mission.envActions,
    missionId: mission.id,
    missionStatus: getMissionStatus(mission),
    missionType: mission.missionType,
    numberOfActions: mission.envActions?.length || 0,
    startDateTimeUtc: mission.startDateTimeUtc
  })

  return feature
}

const getActionControlProperties = (action: EnvActionControlType) => {
  const {
    actionNumberOfControls,
    actionStartDateTimeUtc,
    actionSubTheme,
    actionTargetType,
    actionTheme,
    actionType,
    infractions
  } = action

  return {
    actionNumberOfControls,
    actionStartDateTimeUtc,
    actionSubTheme,
    actionTargetType,
    actionTheme,
    actionType,
    infractions
  }
}

const getActionSurveillanceProperties = (action: EnvActionSurveillanceType) => {
  const { actionStartDateTimeUtc, actionSubTheme, actionTheme, actionType } = action

  return {
    actionStartDateTimeUtc,
    actionSubTheme,
    actionTheme,
    actionType
  }
}

const getActionProperties = (action: EnvActionControlType | EnvActionSurveillanceType) => {
  switch (action.actionType) {
    case ActionTypeEnum.CONTROL:
      return getActionControlProperties(action)
    case ActionTypeEnum.SURVEILLANCE:
    default:
      return getActionSurveillanceProperties(action)
  }
}

const getActionFeature = (action: EnvActionControlType | EnvActionSurveillanceType) => {
  const geoJSON = new GeoJSON()
  const actionProperties = getActionProperties(action)
  if (!action.geom) {
    return null
  }
  const geometry = geoJSON.readGeometry(action.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const feature = new Feature({
    geometry
  })
  feature.setId(`${Layers.ACTIONS.code}:${action.actionType}:${action.id}`)
  feature.setProperties({ ...actionProperties })

  return feature
}

const isActionControlOrActionSurveillance = (f): f is EnvActionControlType | EnvActionSurveillanceType =>
  f.actionType === ActionTypeEnum.CONTROL || f.actionType === ActionTypeEnum.SURVEILLANCE

export const getActionsFeatures = (mission: Partial<MissionType>) => {
  const { envActions } = mission
  if (envActions?.length && envActions?.length > 0) {
    return envActions
      .filter(isActionControlOrActionSurveillance)
      .map(getActionFeature)
      .filter((f): f is Feature<Geometry> => !!f)
  }

  return []
}
