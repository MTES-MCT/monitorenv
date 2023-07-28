import { describe, expect, it } from '@jest/globals'

import { isGeometryValid } from './geometryValidation'

describe('geometryValidation', () => {
  it('should return true for valid polygon or multipolygon', () => {
    const validMultipolygon = JSON.parse(
      '{"type":"MultiPolygon","coordinates":[[[[-5.445293386230469,49.204467319852114],[-6.05778117919922,48.85600950618519],[-5.67154308105469,48.29540491855175],[-5.010646779785157,48.68245162584054],[-5.445293386230469,49.204467319852114]]],[[[-7.436050374755861,49.3354050129181],[-7.502483327636719,48.47791923439382],[-6.779016454467774,48.62143979067412],[-6.059755285034181,49.29388757921399],[-7.436050374755861,49.3354050129181]]]]}'
    )
    const validPolygon = JSON.parse(
      '{"type":"Polygon","coordinates":[[[-4.14598393,49.02650252],[-3.85722498,48.52088004],[-3.54255983,48.92233858],[-3.86251979,49.15131242],[-4.09368042,49.18079556],[-4.14598393,49.02650252]]]}'
    )

    expect(isGeometryValid(validPolygon)).toBe(true)
    expect(isGeometryValid(validMultipolygon)).toBe(true)
  })

  it('should return false for invalid polygon or multipolygon', () => {
    const invalidMultipolygon = JSON.parse(
      '{"type":"MultiPolygon","coordinates":[[[[-5.445293386230469,49.204467319852114],[-6.05778117919922,48.85600950618519],[-5.67154308105469,48.29540491855175],[-5.010646779785157,48.68245162584054],[-5.445293386230469,49.204467319852114]]],[[[-7.436050374755861,49.3354050129181],[-7.502483327636719,48.47791923439382],[-6.79111858154297,49.530603181686615],[-6.779016454467774,48.62143979067412],[-6.059755285034181,49.29388757921399],[-7.436050374755861,49.3354050129181]]]]}'
    )
    const invalidPolygon = JSON.parse(
      '{"type":"Polygon","coordinates":[[[-4.14598393,49.02650252000001],[-3.8572249800000002,48.52088004000001],[-3.5425598300000005,48.92233858],[-4.0509738519287115,48.614290453024864],[-4.09368042,49.18079556000001],[-4.14598393,49.02650252000001]]]}'
    )

    expect(isGeometryValid(invalidMultipolygon)).toBe(false)
    expect(isGeometryValid(invalidPolygon)).toBe(false)
  })

  it('should return true for other geometry types', () => {
    const validPoint = JSON.parse('{"type":"Point","coordinates":[-4.14598393,49.02650252]}')
    const validMultiPoint = JSON.parse('{"type":"MultiPoint","coordinates":[[-4.372753103027346,46.620253579293035]]}')

    expect(isGeometryValid(validPoint)).toBe(true)
    expect(isGeometryValid(validMultiPoint)).toBe(true)
  })
})
