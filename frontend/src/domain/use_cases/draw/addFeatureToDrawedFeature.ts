import { Geometry, MultiPolygon, MultiPoint, Polygon, Point } from 'ol/geom'

import { addGeometryToMultiGeometryGeoJSON, convertToGeoJSONGeometryObject } from '../../entities/layers'
import { InteractionListener, OLGeometryType } from '../../entities/map/constants'
import { setGeometry } from '../../shared_slices/Draw'

import type Feature from 'ol/Feature'

export const addFeatureToDrawedFeature = (featureToAdd: Feature<Geometry>) => (dispatch, getState) => {
  const { geometry, listener } = getState().draw
  const geometryToAdd = featureToAdd.getGeometry()
  if (!geometryToAdd || !listener) {
    return
  }

  if (!geometry || listener === InteractionListener.CONTROL_POINT || listener === InteractionListener.REPORTING_POINT) {
    const typeOfGeometryToAdd = geometryToAdd.getType()

    let nextGeometry
    switch (typeOfGeometryToAdd) {
      case OLGeometryType.POLYGON:
        nextGeometry = convertToGeoJSONGeometryObject(new MultiPolygon([geometryToAdd as Polygon]))
        break
      case OLGeometryType.POINT:
      default:
        nextGeometry = convertToGeoJSONGeometryObject(new MultiPoint([(geometryToAdd as Point).getCoordinates()]))
        break
    }
    dispatch(setGeometry(nextGeometry))

    return
  }

  const nextGeometry = addGeometryToMultiGeometryGeoJSON(geometry, geometryToAdd)
  if (nextGeometry) {
    dispatch(setGeometry(nextGeometry))
  }
}
