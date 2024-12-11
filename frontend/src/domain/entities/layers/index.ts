import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { GeoJSON } from 'ol/format'

import { OLGeometryType } from '../map/constants'

import type { GeoJSON as GeoJSONType } from '../../types/GeoJSON'
import type { MultiPoint, Point, MultiPolygon, Polygon } from 'ol/geom'
import type Geometry from 'ol/geom/Geometry'

export function convertToGeoJSONGeometryObject(feature: Geometry): GeoJSONType.Geometry {
  const format = new GeoJSON()

  return format.writeGeometryObject(feature, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
}

export function addGeometryToMultiGeometryGeoJSON(
  multiGeometry: GeoJSONType.Geometry,
  geometryToAdd: Geometry
): GeoJSONType.Geometry | undefined {
  const nextGeometry = new GeoJSON({
    featureProjection: OPENLAYERS_PROJECTION
  }).readGeometry(multiGeometry)

  if (!nextGeometry) {
    return undefined
  }

  if (nextGeometry.getType() === OLGeometryType.MULTIPOLYGON && geometryToAdd.getType() === OLGeometryType.POLYGON) {
    ;(nextGeometry as MultiPolygon).appendPolygon(geometryToAdd as Polygon)
  }
  if (nextGeometry.getType() === OLGeometryType.MULTIPOINT && geometryToAdd.getType() === OLGeometryType.POINT) {
    ;(nextGeometry as MultiPoint).appendPoint(geometryToAdd as Point)
  }

  return convertToGeoJSONGeometryObject(nextGeometry)
}

export function keepOnlyInitialGeometriesOfMultiGeometry(
  multiGeometry: GeoJSONType.Geometry,
  initialFeatureNumber?: number
): GeoJSONType.Geometry | undefined {
  const nextGeometry = new GeoJSON({
    featureProjection: OPENLAYERS_PROJECTION
  }).readGeometry(multiGeometry)

  const nextGeometryType = nextGeometry.getType() as OLGeometryType

  switch (nextGeometryType) {
    case OLGeometryType.MULTIPOLYGON: {
      const coordinates = (nextGeometry as MultiPolygon).getCoordinates()
      if (!coordinates?.length) {
        return multiGeometry
      }

      const nextCoordinates = coordinates.slice(0, initialFeatureNumber)
      ;(nextGeometry as MultiPolygon)?.setCoordinates(nextCoordinates)
      break
    }
    case OLGeometryType.MULTIPOINT:
    default: {
      const coordinates = (nextGeometry as MultiPoint).getCoordinates()
      if (!coordinates?.length) {
        return multiGeometry
      }

      const nextCoordinates = coordinates.slice(0, initialFeatureNumber)
      ;(nextGeometry as MultiPoint)?.setCoordinates(nextCoordinates)
    }
  }

  return convertToGeoJSONGeometryObject(nextGeometry)
}
