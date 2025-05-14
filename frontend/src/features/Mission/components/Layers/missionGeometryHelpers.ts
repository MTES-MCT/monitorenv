import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  getMissionStatus,
  type Mission,
  type NewMission,
  type NewEnvActionControl,
  type ControlOrSurveillance
} from 'domain/entities/missions'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import { type Geometry } from 'ol/geom'

import { selectedMissionControlStyle, selectedMissionSurveillanceStyle } from './missions.style'
import { getTotalOfControls, getTotalOfSurveillances } from '../../utils'

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

const getActionControlProperties = ({
  actionNumberOfControls,
  actionStartDateTimeUtc,
  actionTargetType,
  actionType,
  infractions,
  tags,
  themes
}: EnvActionControl | NewEnvActionControl) => ({
  actionNumberOfControls,
  actionStartDateTimeUtc,
  actionTargetType,
  actionType,
  infractions,
  tags,
  themes
})

const getActionSurveillanceProperties = ({
  actionEndDateTimeUtc,
  actionStartDateTimeUtc,
  actionType,
  tags,
  themes
}: EnvActionSurveillance) => ({
  actionEndDateTimeUtc,
  actionStartDateTimeUtc,
  actionType,
  tags,
  themes
})

const getActionProperties = (action: ControlOrSurveillance) => {
  switch (action.actionType) {
    case ActionTypeEnum.CONTROL:
      return getActionControlProperties(action)
    case ActionTypeEnum.SURVEILLANCE:
    default:
      return getActionSurveillanceProperties(action)
  }
}

const getActionFeature = (
  action: ControlOrSurveillance,
  missionGeom: Geometry,
  isEditingSurveillanceZoneOrControlPoint: boolean
) => {
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

  if (action.actionType === ActionTypeEnum.CONTROL) {
    feature.setStyle(selectedMissionControlStyle(feature, missionGeom, isEditingSurveillanceZoneOrControlPoint))
  }

  if (action.actionType === ActionTypeEnum.SURVEILLANCE) {
    feature.setStyle(selectedMissionSurveillanceStyle)
  }

  return feature
}

const isActionControlOrActionSurveillance = (feature): feature is ControlOrSurveillance =>
  feature.actionType === ActionTypeEnum.CONTROL || feature.actionType === ActionTypeEnum.SURVEILLANCE

export const getActionsFeatures = (mission, isEditingSurveillanceZoneOrControlPoint = false) => {
  const { envActions, geom: missionGeom } = mission
  if (envActions?.length && envActions?.length > 0) {
    return envActions
      .filter(isActionControlOrActionSurveillance)
      .map(action => getActionFeature(action, missionGeom, isEditingSurveillanceZoneOrControlPoint))
      .filter((f): f is Feature<Geometry> => !!f)
  }

  return []
}
