import { addGeometryToMultiGeometryGeoJSON, convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { OLGeometryType } from 'domain/entities/map/constants'
import { Geometry, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom'

import { dashboardActions } from '../components/slice'

import type { HomeAppThunk } from '@store/index'
import type Feature from 'ol/Feature'

export const drawFeature =
  (featureToAdd: Feature<Geometry>): HomeAppThunk =>
  (dispatch, getState) => {
    const { geometry } = getState().dashboard
    const geometryToAdd = featureToAdd.getGeometry()
    if (!geometryToAdd) {
      return
    }

    if (!geometry) {
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
      dispatch(dashboardActions.setGeometry(nextGeometry))

      return
    }

    const nextGeometry = addGeometryToMultiGeometryGeoJSON(geometry, geometryToAdd)
    if (nextGeometry) {
      dispatch(dashboardActions.setGeometry(nextGeometry))
    }
  }
