import JSTSCoordinate from 'jsts/org/locationtech/jts/geom/Coordinate'
import JSTSGeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory'
import JSTSGeometryGraph from 'jsts/org/locationtech/jts/geomgraph/GeometryGraph'
import JSTSIsSimpleOp from 'jsts/org/locationtech/jts/operation/IsSimpleOp'
import JSTSConsistentAreaTester from 'jsts/org/locationtech/jts/operation/valid/ConsistentAreaTester'
import _ from 'lodash'

import { OLGeometryType } from '../domain/entities/map/constants'

import type { GeoJSON } from '../domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

// Based on https://engblog.nextdoor.com/fast-polygon-self-intersection-detection-in-javascript-a405ba40dd50

const geoJSON2JTS = function geoJSON2JTS(boundaries) {
  return _.map(boundaries, (__, index) => new JSTSCoordinate(boundaries[index][1], boundaries[index][0]))
}

const findSelfIntersects = function findSelfIntersects(geoJsonPolygon) {
  const coordinates = geoJSON2JTS(geoJsonPolygon)
  const geometryFactory = new JSTSGeometryFactory()
  const shell = geometryFactory.createLinearRing(coordinates)
  const jstsPolygon = geometryFactory.createPolygon(shell)
  // if the geometry is aleady a simple linear ring, do not
  // try to find self intersection points.

  const validator = new JSTSIsSimpleOp(jstsPolygon)

  if (validator.isSimpleLinearGeometry(jstsPolygon)) {
    return undefined
  }

  const res = [] as any
  const graph = new JSTSGeometryGraph(0, jstsPolygon)
  const cat = new JSTSConsistentAreaTester(graph)
  const r = cat.isNodeConsistentArea()

  if (!r) {
    const pt = cat.getInvalidPoint()
    res.push([pt.x, pt.y])
  }

  return res
}

function IsPolygonValid(polygon: Coordinate[][]) {
  // Construct a array of point
  const pointsArray = _.flattenDeep(polygon)

  const coordinates = _.chunk(pointsArray, 2)

  if (coordinates.length < 3) {
    // Polygon has less than 3 points
    return false
  }

  // Check the polygon closure (first and last points are equals)
  const firstPoint = coordinates[0]
  const lastPoint = coordinates[coordinates.length - 1]
  if (
    (firstPoint && lastPoint && firstPoint[0] !== lastPoint[0]) ||
    (firstPoint && lastPoint && firstPoint[1] !== lastPoint[1])
  ) {
    // Polygon is not closed
    return false
  }

  // Check no self intersecting
  const intersectionPoints = findSelfIntersects(coordinates)

  if (intersectionPoints && intersectionPoints.length > 0) {
    // Polygon has self intersecting
    return false
  }

  // Check no duplicate points
  let stringArray = _.reduce(
    coordinates,
    (accu, coordinate) => {
      if (coordinate) {
        accu.push(`${coordinate[0]} ${coordinate[1]}`)
      }

      return accu
    },
    [] as string[]
  )

  // Remove the last point that is a duplicate of the first point
  stringArray = _.dropRight(stringArray)

  if (stringArray && stringArray.length !== _.uniq(stringArray).length) {
    return false
  }

  return true
}

function ArePolygonsValid(polygons: Coordinate[][][]) {
  return _.reduce(polygons, (result, polygon) => result && IsPolygonValid(polygon), true)
}

export function IsGeometryValid(geometry: GeoJSON.Geometry) {
  if (geometry && geometry.type === OLGeometryType.MULTIPOLYGON) {
    return ArePolygonsValid(geometry.coordinates as Coordinate[][][])
  }
  if (geometry && geometry.type === OLGeometryType.POLYGON) {
    return IsPolygonValid(geometry.coordinates as Coordinate[][])
  }

  // other geometry types (POINTS) are valid by default
  return true
}
