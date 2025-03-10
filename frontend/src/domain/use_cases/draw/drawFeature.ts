import { addGeometryToMultiGeometryGeoJSON, convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { OLGeometryType } from 'domain/entities/map/constants'
import { Geometry, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom'

import type { HomeAppThunk, HomeRootState } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type Feature from 'ol/Feature'

type GeometryAction = (geometry: GeoJSON.Geometry) => void
type GeometrySelector = (state: HomeRootState) => GeoJSON.Geometry | undefined

export const drawFeature =
  (
    featureToAdd: Feature<Geometry>,
    setGeometryAction: GeometryAction,
    selectGeometry: GeometrySelector
  ): HomeAppThunk =>
  (_, getState) => {
    const geometry = selectGeometry(getState())
    const geometryToAdd = featureToAdd.getGeometry()

    if (!geometryToAdd) {
      return
    }

    if (!geometry) {
      const typeOfGeometryToAdd = geometryToAdd.getType()

      let nextGeometry: GeoJSON.Geometry | undefined
      switch (typeOfGeometryToAdd) {
        case OLGeometryType.POLYGON:
          nextGeometry = convertToGeoJSONGeometryObject(new MultiPolygon([geometryToAdd as Polygon]))
          break
        case OLGeometryType.POINT:
        default:
          nextGeometry = convertToGeoJSONGeometryObject(new MultiPoint([(geometryToAdd as Point).getCoordinates()]))
          break
      }
      setGeometryAction(nextGeometry)

      return
    }

    const nextGeometry = addGeometryToMultiGeometryGeoJSON(geometry, geometryToAdd)
    if (nextGeometry) {
      setGeometryAction(nextGeometry)
    }
  }
