import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'
import { MultiPolygon, Polygon, Point, MultiPoint } from 'ol/geom'

import { setFeatureType, resetInteraction, setFeatures, setInteractionType, resetFeatures } from "../../../features/drawLayer/DrawLayer.slice"
import { setDisplayedItems } from "../../shared_slices/Global"

import { monitorenvFeatureTypes, interactionTypes, olGeometryTypes } from "../../entities/drawLayer"
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../entities/map'

const convertToGeometryObject = (feature) => {
  const format = new GeoJSON()
  const geoJSONGeometry = format.writeGeometryObject(feature, {
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        })
  return geoJSONGeometry
}

const openDrawLayerModal = (dispatch) => {
  dispatch(setDisplayedItems({
    displayLayersSidebar: false,
    displayMissionsMenu: false,
    displayMeasurement: false,
    displayLocateOnMap: false,
    displayInterestPoint: false,
    displayDrawLayerModal: true
  }))
}

const closeDrawLayerModal = (dispatch) => {
  dispatch(setDisplayedItems({
    displayLayersSidebar: true,
    displayMissionsMenu: true,
    displayMeasurement: true,
    displayLocateOnMap: true,
    displayInterestPoint: true,
    displayDrawLayerModal: false
  }))
}

export const addMissionZone = ({callback, geom} ) => (dispatch) => {
  const features = (geom?.type === olGeometryTypes.MULTIPOLYGON) &&  geom?.coordinates?.length > 0 && geom.coordinates.map(coord=> {
    return new Feature({
      geometry: new Polygon(coord).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    })
  })
  features && dispatch(setFeatures(features))
  dispatch(openDrawLayerModal)
  dispatch(setFeatureType({featureType: monitorenvFeatureTypes.MISSION_ZONE, callback}))
  dispatch(setInteractionType(interactionTypes.POLYGON))
}


export const addControlPositions = ({callback, geom} ) => (dispatch) => {
  const features = geom?.type=== olGeometryTypes.MULTIPOINT &&  geom?.coordinates?.length > 0 && geom.coordinates.map(coord=> {
    return new Feature({
      geometry: new Point(coord).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    })
  })
  features && dispatch(setFeatures(features))
  dispatch(openDrawLayerModal)
  dispatch(setFeatureType({featureType: monitorenvFeatureTypes.ACTION_LOCALISATION, callback}))
  dispatch(setInteractionType(interactionTypes.POINT))

}

export const quitAddLocalisation = (dispatch) => {
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}

export const validateLocalisation = (dispatch, getState) => {
  const { drawLayer } = getState()
  const { callback, features, featureType } = drawLayer
  if (typeof callback === 'function') {
    switch(featureType) {
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
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}

export const quitEditMission = (dispatch) => {
  dispatch(resetFeatures())
  dispatch(resetInteraction())
}