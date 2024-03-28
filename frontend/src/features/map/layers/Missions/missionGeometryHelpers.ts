import { type Coordinates } from '@mtes-mct/monitor-ui'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import { type Geometry } from 'ol/geom'
import { circular } from 'ol/geom/Polygon'

import { selectedMissionControlStyle, selectedMissionSurveillanceStyle } from './missions.style'
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
    isGeometryComputedFromControls: mission.isGeometryComputedFromControls,
    missionId: mission.id,
    missionSource: mission.missionSource,
    missionStatus: getMissionStatus(mission),
    missionTypes: mission.missionTypes,
    numberOfActions: mission.envActions?.length ?? 0,
    numberOfControls: getTotalOfControls(mission),
    numberOfSurveillance: getTotalOfSurveillances(mission),
    overlayCoordinates: undefined,
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

const getActionFeature = (
  action: EnvActionControl | EnvActionSurveillance | NewEnvActionControl,
  isGeometryComputedFromControls: Boolean
) => {
  const geoJSON = new GeoJSON()
  const actionProperties = getActionProperties(action)
  if (!action.geom) {
    return null
  }
  let geometry = geoJSON.readGeometry(action.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  // if the mission geometry is computed from the controls
  // we want to display controls with a circular geometry
  if (
    action.actionType === ActionTypeEnum.CONTROL &&
    isGeometryComputedFromControls &&
    action.geom.coordinates.length > 0
  ) {
    const coordinates = action.geom.coordinates[0] as Coordinates
    geometry = circular([coordinates[0], coordinates[1]], 4000, 64).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
  }

  const feature = new Feature({
    geometry
  })
  feature.setId(`${Layers.ACTIONS.code}:${action.actionType}:${action.id}`)
  feature.setProperties({ ...actionProperties })
  feature.setProperties({ ...actionProperties, isGeometryComputedFromControls })

  if (action.actionType === ActionTypeEnum.CONTROL) {
    feature.setStyle(selectedMissionControlStyle)
  }

  if (action.actionType === ActionTypeEnum.SURVEILLANCE) {
    feature.setStyle(selectedMissionSurveillanceStyle)
  }

  return feature
}

const isActionControlOrActionSurveillance = (f): f is EnvActionControl | EnvActionSurveillance | NewEnvActionControl =>
  f.actionType === ActionTypeEnum.CONTROL || f.actionType === ActionTypeEnum.SURVEILLANCE

export const getActionsFeatures = mission => {
  const { envActions, isGeometryComputedFromControls } = mission
  if (envActions?.length && envActions?.length > 0) {
    return envActions
      .filter(isActionControlOrActionSurveillance)
      .map(action => getActionFeature(action, isGeometryComputedFromControls))
      .filter((f): f is Feature<Geometry> => !!f)
  }

  return []
}
