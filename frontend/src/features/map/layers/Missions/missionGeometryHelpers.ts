import { Mission } from '@features/Mission/mission.type'
import { getMissionStatus, getTotalOfControls, getTotalOfSurveillances } from '@features/Mission/utils'
import { type Coordinates } from '@mtes-mct/monitor-ui'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import { type Geometry } from 'ol/geom'
import { circular } from 'ol/geom/Polygon'

import { selectedMissionControlStyle, selectedMissionSurveillanceStyle } from './missions.style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'

export const getMissionZoneFeature = (mission: Partial<Mission.Mission | Mission.NewMission>, layername: string) => {
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
    envActions: mission.envActions ?? [],
    fishActions: mission.fishActions ?? [],
    isGeometryComputedFromControls: mission.isGeometryComputedFromControls,
    missionId: mission.id,
    missionStatus: getMissionStatus(mission),
    missionTypes: mission.missionTypes,
    numberOfActions: mission.envActions?.length ?? 0,
    numberOfControls: getTotalOfControls(mission.envActions ?? []),
    numberOfSurveillance: getTotalOfSurveillances(mission.envActions ?? []),
    overlayCoordinates: undefined,
    startDateTimeUtc: mission.startDateTimeUtc
  })

  return feature
}

const getActionControlProperties = (action: Mission.EnvActionControl | Mission.NewEnvActionControl) => {
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

const getActionSurveillanceProperties = (action: Mission.EnvActionSurveillance) => {
  const { actionEndDateTimeUtc, actionStartDateTimeUtc, actionType, controlPlans } = action

  return {
    actionEndDateTimeUtc,
    actionStartDateTimeUtc,
    actionType,
    controlPlans
  }
}

const getActionProperties = (
  action: Mission.EnvActionControl | Mission.EnvActionSurveillance | Mission.NewEnvActionControl
) => {
  switch (action.actionType) {
    case Mission.ActionTypeEnum.CONTROL:
      return getActionControlProperties(action)
    case Mission.ActionTypeEnum.SURVEILLANCE:
    default:
      return getActionSurveillanceProperties(action)
  }
}

const getActionFeature = (
  action: Mission.EnvActionControl | Mission.EnvActionSurveillance | Mission.NewEnvActionControl,
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
    action.actionType === Mission.ActionTypeEnum.CONTROL &&
    isGeometryComputedFromControls &&
    action.geom.coordinates.length > 0
  ) {
    const coordinates = action.geom.coordinates[0] as Coordinates
    geometry = circular([coordinates[0], coordinates[1]], Mission.CIRCULAR_ZONE_RADIUS, 64).transform(
      WSG84_PROJECTION,
      OPENLAYERS_PROJECTION
    )
  }

  const feature = new Feature({
    geometry
  })
  feature.setId(`${Layers.ACTIONS.code}:${action.actionType}:${action.id}`)
  feature.setProperties({ ...actionProperties })
  feature.setProperties({ ...actionProperties, isGeometryComputedFromControls })

  if (action.actionType === Mission.ActionTypeEnum.CONTROL) {
    feature.setStyle(selectedMissionControlStyle)
  }

  if (action.actionType === Mission.ActionTypeEnum.SURVEILLANCE) {
    feature.setStyle(selectedMissionSurveillanceStyle)
  }

  return feature
}

const isActionControlOrActionSurveillance = (
  f
): f is Mission.EnvActionControl | Mission.EnvActionSurveillance | Mission.NewEnvActionControl =>
  f.actionType === Mission.ActionTypeEnum.CONTROL || f.actionType === Mission.ActionTypeEnum.SURVEILLANCE

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
