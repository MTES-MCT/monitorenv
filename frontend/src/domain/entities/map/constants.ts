export const WSG84_PROJECTION = 'EPSG:4326'
export const OPENLAYERS_PROJECTION = 'EPSG:3857'

export enum InteractionType {
  CIRCLE = 'CIRCLE',
  POINT = 'POINT',
  POLYGON = 'POLYGON',
  SELECTION = 'SELECTION',
  SQUARE = 'SQUARE'
}

export enum InteractionListener {
  CONTROL_POINT = 'CONTROL_POINT',
  INTEREST_POINT = 'INTEREST_POINT',
  MEASUREMENT = 'MEASUREMENT',
  MISSION_ZONE = 'MISSION_ZONE',
  REPORTING_POINT = 'REPORTING_POINT',
  REPORTING_ZONE = 'REPORTING_ZONE',
  SURVEILLANCE_ZONE = 'SURVEILLANCE_ZONE',
  VIGILANCE_ZONE = 'VIGILANCE_ZONE'
}

export enum MeasurementType {
  CIRCLE_RANGE = 'Circle',
  MULTILINE = 'LineString'
}

export enum CoordinatesFormat {
  DECIMAL_DEGREES = 'DD',
  DEGREES_MINUTES_DECIMALS = 'DMD',
  DEGREES_MINUTES_SECONDS = 'DMS'
}

export enum CoordinatesFormatLabel {
  DMS = 'DMS',
  // eslint-disable-next-line typescript-sort-keys/string-enum
  DMD = 'DMD',
  // eslint-disable-next-line typescript-sort-keys/string-enum
  DD = 'DD'
}

export enum DistanceUnit {
  METRIC = 'metric',
  NAUTICAL = 'nautical'
}

export enum MapToolType {
  DASHBOARD = 'DASHBOARD',
  FILTERS = 'FILTERS',
  INTEREST_POINT = 'INTEREST_POINT',
  MEASUREMENT = 'MEASUREMENT',
  MEASUREMENT_MENU = 'MEASUREMENT_MENU',
  VESSEL_LABELS = 'VESSEL_LABELS',
  VESSEL_VISIBILITY = 'VESSEL_VISIBILITY'
}

export enum OLGeometryType {
  CIRCLE = 'Circle',
  MULTIPOINT = 'MultiPoint',
  MULTIPOLYGON = 'MultiPolygon',
  POINT = 'Point',
  POLYGON = 'Polygon'
}

export const GeoJSONWithMultipleCoordinates = [OLGeometryType.MULTIPOLYGON, OLGeometryType.MULTIPOINT]

export const InteractionListenerToOLGeometryType: Record<InteractionListener, OLGeometryType | undefined> = {
  [InteractionListener.CONTROL_POINT]: OLGeometryType.MULTIPOINT,
  [InteractionListener.INTEREST_POINT]: undefined,
  [InteractionListener.MEASUREMENT]: undefined,
  [InteractionListener.SURVEILLANCE_ZONE]: OLGeometryType.MULTIPOLYGON,
  [InteractionListener.MISSION_ZONE]: OLGeometryType.MULTIPOLYGON,
  [InteractionListener.REPORTING_ZONE]: OLGeometryType.MULTIPOLYGON,
  [InteractionListener.REPORTING_POINT]: OLGeometryType.MULTIPOINT,
  [InteractionListener.VIGILANCE_ZONE]: OLGeometryType.MULTIPOLYGON
}
