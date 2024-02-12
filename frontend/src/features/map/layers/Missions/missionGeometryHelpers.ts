import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'

import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'
import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  getMissionStatus,
  type Mission,
  type NewMission,
  type NewEnvActionControl
} from '../../../../domain/entities/missions'
import { getTotalOfControls, getTotalOfSurveillances } from '../../../missions/utils'

import type { Geometry } from 'ol/geom'

export const getMissionZoneFeature = (mission: Partial<Mission | NewMission>, layername: string) => {
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
    numberOfActions: mission.envActions?.length ?? 0,
    numberOfControls: getTotalOfControls(mission),
    numberOfSurveillance: getTotalOfSurveillances(mission),
    startDateTimeUtc: mission.startDateTimeUtc
  })

  return feature
}

const getActionControlProperties = (action: EnvActionControl | NewEnvActionControl) => {
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, actionType, controlPlans, infractions } =
    action

  return {
    actionNumberOfControls,
    actionStartDateTimeUtc,
    actionTargetType,
    actionType,
    controlPlans,
    infractions
  }
}

const getActionSurveillanceProperties = (action: EnvActionSurveillance) => {
  const { actionEndDateTimeUtc, actionStartDateTimeUtc, actionType, controlPlans } = action

  return {
    actionEndDateTimeUtc,
    actionStartDateTimeUtc,
    actionType,
    controlPlans
  }
}

const getActionProperties = (action: EnvActionControl | EnvActionSurveillance | NewEnvActionControl) => {
  switch (action.actionType) {
    case ActionTypeEnum.CONTROL:
      return getActionControlProperties(action)
    case ActionTypeEnum.SURVEILLANCE:
    default:
      return getActionSurveillanceProperties(action)
  }
}

const getActionFeature = (action: EnvActionControl | EnvActionSurveillance | NewEnvActionControl) => {
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

const isActionControlOrActionSurveillance = (f): f is EnvActionControl | EnvActionSurveillance | NewEnvActionControl =>
  f.actionType === ActionTypeEnum.CONTROL || f.actionType === ActionTypeEnum.SURVEILLANCE

export const getActionsFeatures = mission => {
  const { envActions } = mission
  if (envActions?.length && envActions?.length > 0) {
    return envActions
      .filter(isActionControlOrActionSurveillance)
      .map(getActionFeature)
      .filter((f): f is Feature<Geometry> => !!f)
  }

  return []
}
