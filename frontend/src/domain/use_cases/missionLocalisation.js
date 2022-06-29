import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'
import { MultiPolygon, Polygon } from 'ol/geom'

import { setFeatureType, resetFeatures, resetInteraction, addFeatures } from "../../features/drawLayer/DrawLayer.slice"
import { setDisplayedItems } from "../shared_slices/Global"

import { featureTypes } from "../entities/drawLayer"
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../entities/map'

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
  const features = geom?.type==='MultiPolygon' &&  geom?.coordinates?.length > 0 && geom.coordinates.map(coord=> {
    return new Feature({
      geometry: new Polygon(coord).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    })
  })
  features && dispatch(addFeatures(features))
  dispatch(openDrawLayerModal)
  dispatch(setFeatureType({featureType: featureTypes.MISSION_ZONE, callback}))
}

export const quitAddLocalisation = (dispatch) => {
  dispatch(closeDrawLayerModal)
  dispatch(setFeatureType(null))
  dispatch(resetFeatures())
}

export const validateLocalisation = (dispatch, getState) => {
  const { drawLayer } = getState()
  const { callback, features, featureType } = drawLayer
  if (typeof callback === 'function') {
    if (featureType === featureTypes.MISSION_ZONE) {
      const geometryArray = features.map(f => f.getGeometry())
      const geometry = convertToGeometryObject(new MultiPolygon(geometryArray))
      callback(geometry)
    }
  }
  dispatch(closeDrawLayerModal)
  dispatch(resetInteraction())
}

const convertToGeometryObject = (feature) => {
  const format = new GeoJSON()
  const geoJSONGeometry = format.writeGeometryObject(feature, {
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        })
  return geoJSONGeometry
}