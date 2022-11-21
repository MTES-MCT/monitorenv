import _ from 'lodash'
import { boundingExtent } from 'ol/extent'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import { MultiPolygon, Polygon, Point, MultiPoint } from 'ol/geom'
import { transformExtent } from 'ol/proj'

import {
  setFeatureType,
  resetInteraction,
  setFeatures,
  setInteractionType,
  resetFeatures
} from '../../../features/drawLayer/DrawLayer.slice'
import { monitorenvFeatureTypes, interactionTypes, olGeometryTypes } from '../../entities/drawLayer'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../entities/map'
import { setDisplayedItems } from '../../shared_slices/Global'
import { setFitToExtent } from '../../shared_slices/Map'

const convertToGeometryObject = feature => {
  const format = new GeoJSON()
  const geoJSONGeometry = format.writeGeometryObject(feature, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  return geoJSONGeometry
}

const openDrawLayerModal = dispatch => {
  dispatch(
    setDisplayedItems({
      displayDrawLayerModal: true,
      displayInterestPoint: false,
      displayLayersSidebar: false,
      displayLocateOnMap: false,
      displayMeasurement: false,
      displayMissionMenuButton: false,
      displayMissionsLayer: false,
      displayMissionsOverlay: false,
      displaySelectedMissionLayer: false
    })
  )
}

const closeDrawLayerModal = dispatch => {
  dispatch(
    setDisplayedItems({
      displayDrawLayerModal: false,
      displayInterestPoint: true,
      displayLayersSidebar: true,
      displayLocateOnMap: true,
      displayMeasurement: true,
      displayMissionMenuButton: true,
      displayMissionsLayer: true,
      displayMissionsOverlay: true,
      displaySelectedMissionLayer: true
    })
  )
}

export const addMissionZone =
  ({ callback, geom }) =>
  dispatch => {
    const features =
      geom?.type === olGeometryTypes.MULTIPOLYGON &&
      geom?.coordinates?.length > 0 &&
      geom.coordinates.map(
        coord =>
          new Feature({
            geometry: new Polygon(coord).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
          })
      )
    if (features) {
      dispatch(setFeatures(features))
    }
    if (geom?.coordinates?.length) {
      dispatch(
        setFitToExtent(
          transformExtent(boundingExtent(_.flattenDepth(geom.coordinates, 2)), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
        )
      )
    }
    dispatch(openDrawLayerModal)
    dispatch(setFeatureType({ callback, featureType: monitorenvFeatureTypes.MISSION_ZONE }))
    dispatch(setInteractionType(interactionTypes.POLYGON))
  }

export const addControlPositions =
  ({ callback, geom, missionGeom }) =>
  dispatch => {
    const features =
      geom?.type === olGeometryTypes.MULTIPOINT &&
      geom?.coordinates?.length > 0 &&
      geom.coordinates.map(
        coord =>
          new Feature({
            geometry: new Point(coord).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
          })
      )
    if (features) {
      dispatch(setFeatures(features))
    }
    if (missionGeom?.coordinates?.length) {
      dispatch(
        setFitToExtent(
          transformExtent(
            boundingExtent(_.flattenDepth(missionGeom.coordinates, 2)),
            WSG84_PROJECTION,
            OPENLAYERS_PROJECTION
          )
        )
      )
    }
    dispatch(openDrawLayerModal)
    dispatch(setFeatureType({ callback, featureType: monitorenvFeatureTypes.ACTION_LOCALISATION }))
    dispatch(setInteractionType(interactionTypes.POINT))
  }

export const quitAddLocalisation = dispatch => {
  dispatch(resetFeatures())
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}

export const validateLocalisation = (dispatch, getState) => {
  const { drawLayer } = getState()
  const { callback, features, featureType } = drawLayer
  if (typeof callback === 'function') {
    switch (featureType) {
      case monitorenvFeatureTypes.MISSION_ZONE: {
        const geometryArray = features.map(f => f.getGeometry())
        const geometry = convertToGeometryObject(new MultiPolygon(geometryArray))
        callback(geometry)
        break
      }
      case monitorenvFeatureTypes.ACTION_LOCALISATION: {
        const geometryArray = features.map(f => f.getGeometry()?.getCoordinates())
        const geometry = convertToGeometryObject(new MultiPoint(geometryArray))
        callback(geometry)
        break
      }
      default:
        break
    }
  }
  dispatch(resetFeatures())
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}

export const quitEditMission = dispatch => {
  dispatch(resetFeatures())
  dispatch(resetInteraction())
}
