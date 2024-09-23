import { expect } from '@jest/globals'

import { geoJsonToWKT } from './geojsonToWKT'

describe('GeoJSON to WKT conversion', () => {
  it('should convert Point to WKT', () => {
    const geoJson = {
      coordinates: [100.0, 0.0],
      type: 'Point'
    }
    const wkt = geoJsonToWKT(geoJson)
    expect(wkt).toBe('POINT (100 0)')
  })

  it('should convert LineString to WKT', () => {
    const geoJson = {
      coordinates: [
        [100.0, 0.0],
        [101.0, 1.0]
      ],
      type: 'LineString'
    }
    const wkt = geoJsonToWKT(geoJson)
    expect(wkt).toBe('LINESTRING (100 0, 101 1)')
  })

  it('should convert Polygon to WKT', () => {
    const geoJson = {
      coordinates: [
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0]
        ]
      ],
      type: 'Polygon'
    }
    const wkt = geoJsonToWKT(geoJson)
    expect(wkt).toBe('POLYGON ((100 0, 101 0, 101 1, 100 1, 100 0))')
  })

  it('should convert MultiPoint to WKT', () => {
    const geoJson = {
      coordinates: [
        [100.0, 0.0],
        [101.0, 1.0]
      ],
      type: 'MultiPoint'
    }
    const wkt = geoJsonToWKT(geoJson)
    expect(wkt).toBe('MULTIPOINT (100 0, 101 1)')
  })

  it('should convert MultiLineString to WKT', () => {
    const geoJson = {
      coordinates: [
        [
          [100.0, 0.0],
          [101.0, 1.0]
        ],
        [
          [102.0, 2.0],
          [103.0, 3.0]
        ]
      ],
      type: 'MultiLineString'
    }
    const wkt = geoJsonToWKT(geoJson)
    expect(wkt).toBe('MULTILINESTRING ((100 0, 101 1), (102 2, 103 3))')
  })

  it('should convert MultiPolygon to WKT', () => {
    const geoJson = {
      coordinates: [
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ],
        [
          [
            [102.0, 2.0],
            [103.0, 2.0],
            [103.0, 3.0],
            [102.0, 3.0],
            [102.0, 2.0]
          ]
        ]
      ],
      type: 'MultiPolygon'
    }
    const wkt = geoJsonToWKT(geoJson)
    expect(wkt).toBe('MULTIPOLYGON (((100 0, 101 0, 101 1, 100 1, 100 0)), ((102 2, 103 2, 103 3, 102 3, 102 2)))')
  })

  it('should throw an error for unsupported GeoJSON type', () => {
    const geoJson = {
      coordinates: [100.0, 0.0],
      type: 'unsupported type'
    }
    expect(() => geoJsonToWKT(geoJson)).toThrow('Unsupported GeoJSON type: unsupported type')
  })
})
