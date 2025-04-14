export enum BaseLayer {
  LIGHT = 'LIGHT',
  OSM = 'OSM',
  SATELLITE = 'SATELLITE',
  SHOM = 'SHOM'
}

export const BaseLayerLabel: Record<BaseLayer, string> = {
  [BaseLayer.LIGHT]: 'Fond de carte clair',
  [BaseLayer.OSM]: 'Open Street Map',
  [BaseLayer.SATELLITE]: 'Satellite',
  [BaseLayer.SHOM]: 'Carte marine (SHOM)'
}
