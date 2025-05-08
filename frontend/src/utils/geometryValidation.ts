import JSTSCoordinate from 'jsts/org/locationtech/jts/geom/Coordinate'
import JSTSGeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory'
import JSTSGeometryGraph from 'jsts/org/locationtech/jts/geomgraph/GeometryGraph'
import JSTSIsSimpleOp from 'jsts/org/locationtech/jts/operation/IsSimpleOp'
import JSTSConsistentAreaTester from 'jsts/org/locationtech/jts/operation/valid/ConsistentAreaTester'
import { dropRight, map, flattenDeep, chunk, reduce, uniq } from 'lodash-es'

import { OLGeometryType } from '../domain/entities/map/constants'

import type { GeoJSON } from '../domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

// Based on https://engblog.nextdoor.com/fast-polygon-self-intersection-detection-in-javascript-a405ba40dd50

const geoJSON2JTS = function geoJSON2JTS(boundaries) {
  return map(boundaries, (__, index) => new JSTSCoordinate(boundaries[index][1], boundaries[index][0]))
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

  const res: number[][] = []
  const graph = new JSTSGeometryGraph(0, jstsPolygon)
  const cat = new JSTSConsistentAreaTester(graph)
  const r = cat.isNodeConsistentArea()

  if (!r) {
    const pt = cat.getInvalidPoint()
    res.push([pt.x, pt.y])
  }

  return res
}

function isPolygonValid(polygon: Coordinate[][]) {
  // Construct a array of point
  const pointsArray = flattenDeep(polygon)

  const coordinates = chunk(pointsArray, 2)

  if (coordinates.length < 3) {
    // Polygon has less than 3 points
    return false
  }

  // Check the polygon closure (first and last points are equals)
  const firstPoint = coordinates[0]
  const lastPoint = coordinates[coordinates.length - 1]
  if (
    (firstPoint && lastPoint && firstPoint[0] !== lastPoint[0]) ??
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
  let stringArray = reduce(
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
  stringArray = dropRight(stringArray)

  if (stringArray && stringArray.length !== uniq(stringArray).length) {
    return false
  }

  return true
}

function arePolygonsValid(polygons: Coordinate[][][] | undefined) {
  return reduce(polygons, (result, polygon) => result && isPolygonValid(polygon), true)
}

export function isGeometryValid(geometry: GeoJSON.Geometry | undefined) {
  if (!geometry) {
    return false
  }
  if (geometry.type === OLGeometryType.MULTIPOLYGON) {
    return !!geometry.coordinates.length && arePolygonsValid(geometry.coordinates as Coordinate[][][])
  }
  if (geometry.type === OLGeometryType.POLYGON) {
    return isPolygonValid(geometry.coordinates as Coordinate[][])
  }

  // other geometry types (POINTS) are valid by default
  return true
}
