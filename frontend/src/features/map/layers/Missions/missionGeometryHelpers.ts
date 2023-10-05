import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'

import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'
import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  getMissionStatus,
  getTotalOfControls,
  getTotalOfSurveillances,
  type Mission
} from '../../../../domain/entities/missions'

import type { Geometry } from 'ol/geom'

export const getMissionCentroid = (mission: Partial<Mission>, layername: string) => {
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
    attachedReportingIds: mission.attachedReportingIds,
    attachedReportings: mission.attachedReportings,
    controlUnits: mission.controlUnits,
    endDateTimeUtc: mission.endDateTimeUtc,
    missionId: mission.id,
    missionStatus: getMissionStatus(mission),
    missionTypes: mission.missionTypes,
    numberOfActions: mission.envActions?.length || 0,
    startDateTimeUtc: mission.startDateTimeUtc
  })

  return pointFeature
}

export const getMissionZoneFeature = (mission: Partial<Mission>, layername: string) => {
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
    attachedReportingIds: mission.attachedReportingIds,
    attachedReportings: mission.attachedReportings,
    controlUnits: mission.controlUnits,
    endDateTimeUtc: mission.endDateTimeUtc,
    envActions: mission.envActions,
    missionId: mission.id,
    missionSource: mission.missionSource,
    missionStatus: getMissionStatus(mission),
    missionTypes: mission.missionTypes,
    numberOfActions: mission.envActions?.length || 0,
    numberOfControls: getTotalOfControls(mission),
    numberOfSurveillance: getTotalOfSurveillances(mission),
    startDateTimeUtc: mission.startDateTimeUtc
  })

  return feature
}

const getActionControlProperties = (action: EnvActionControl) => {
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, actionType, infractions, themes } = action

  return {
    actionNumberOfControls,
    actionStartDateTimeUtc,
    actionTargetType,
    actionType,
    infractions,
    themes
  }
}

const getActionSurveillanceProperties = (action: EnvActionSurveillance) => {
  const { actionEndDateTimeUtc, actionStartDateTimeUtc, actionType, themes } = action

  return {
    actionEndDateTimeUtc,
    actionStartDateTimeUtc,
    actionType,
    themes
  }
}

const getActionProperties = (action: EnvActionControl | EnvActionSurveillance) => {
  switch (action.actionType) {
    case ActionTypeEnum.CONTROL:
      return getActionControlProperties(action)
    case ActionTypeEnum.SURVEILLANCE:
    default:
      return getActionSurveillanceProperties(action)
  }
}

const getActionFeature = (action: EnvActionControl | EnvActionSurveillance) => {
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

const isActionControlOrActionSurveillance = (f): f is EnvActionControl | EnvActionSurveillance =>
  f.actionType === ActionTypeEnum.CONTROL || f.actionType === ActionTypeEnum.SURVEILLANCE

export const getActionsFeatures = (mission: Partial<Mission>) => {
  const { envActions } = mission
  if (envActions?.length && envActions?.length > 0) {
    return envActions
      .filter(isActionControlOrActionSurveillance)
      .map(getActionFeature)
      .filter((f): f is Feature<Geometry> => !!f)
  }

  return []
}
