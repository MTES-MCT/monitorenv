/**
 * convert GeoJSON into Well Known Text (WKT)
 *
 * @param geoJson {GeoJSON.Geometry}
 * @returns {string} a WKT representation of GeoJSON geometry
 * @throw Unsupported GeoJSON type
 */
export function geoJsonToWKT(geoJson: any): string {
  const { type } = geoJson

  switch (type) {
    case 'Point':
      return `POINT (${geoJson.coordinates.join(' ')})`

    case 'LineString':
      return `LINESTRING (${geoJson.coordinates.map(coord => coord.join(' ')).join(', ')})`

    case 'Polygon':
      return `POLYGON ((${geoJson.coordinates[0] && geoJson.coordinates[0].map(coord => coord.join(' ')).join(', ')}))`

    case 'MultiPoint':
      return `MULTIPOINT (${geoJson.coordinates.map(coord => coord.join(' ')).join(', ')})`

    case 'MultiLineString':
      return `MULTILINESTRING (${geoJson.coordinates
        .map(line => `(${line.map(coord => coord.join(' ')).join(', ')})`)
        .join(', ')})`

    case 'MultiPolygon':
      return `MULTIPOLYGON (${geoJson.coordinates
        .map(polygon => `((${polygon[0] && polygon[0].map(coord => coord.join(' ')).join(', ')}))`)
        .join(', ')})`

    case 'GeometryCollection':
      return `GEOMETRYCOLLECTION (${geoJson.geometries.map((geometry: any) => geoJsonToWKT(geometry)).join(', ')})`

    default:
      throw new Error(`Unsupported GeoJSON type: ${type}`)
  }
}
