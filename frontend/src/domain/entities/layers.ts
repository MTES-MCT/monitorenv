/**
 *
 * @param {Object} layer
 * @param { String } layer.type
 * @param { String } layer.topic
 * @param { String } layer.zone
 * @returns String
 */
export const getLayerNameNormalized = layer => [layer.type, layer.topic, layer.zone].filter(Boolean).join(':')

export const layersType = {
  ADMINISTRATIVE: 'ADMINISTRATIVE',
  BASE_LAYER: 'BASE_LAYER',
  FREE_DRAW: 'FREE_DRAW',
  MEASUREMENT: 'MEASUREMENT',
  REGULATORY: 'REGULATORY'
}

export const Layers = {
  ACTIONS: {
    code: 'actions',
    zIndex: 1110
  },
  AEM: {
    code: 'aem_areas',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: 'Zones AEM (MED)',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: 'name',
    type: layersType.ADMINISTRATIVE
  },
  BASE_LAYER: {
    code: 'baselayer',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.BASE_LAYER
  },
  DRAW_LAYER: {
    code: 'draw_layer',
    zIndex: 1500
  },
  EEZ: {
    code: 'eez_areas',
    containsMultipleZones: true,
    group: null,
    isIntersectable: true,
    name: 'Zones ZEE',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: 'union',
    type: layersType.ADMINISTRATIVE
  },
  FAO: {
    code: 'fao_areas',
    containsMultipleZones: true,
    getZoneName: feature => {
      if (feature.get(Layers.FAO.subSubZoneFieldKey)) {
        return feature.get(Layers.FAO.subSubZoneFieldKey)
      }
      if (feature.get(Layers.FAO.subZoneFieldKey)) {
        return feature.get(Layers.FAO.subZoneFieldKey)
      }
      if (feature.get(Layers.FAO.zoneFieldKey)) {
        return feature.get(Layers.FAO.zoneFieldKey)
      }

      return ''
    },
    group: null,
    isIntersectable: true,
    name: 'Zones FAO / CIEM',
    showMultipleZonesInAdministrativeZones: false,
    subSubZoneFieldKey: 'f_subdivis',
    subZoneFieldKey: 'f_division',
    type: layersType.ADMINISTRATIVE,
    zoneFieldKey: 'f_subarea'
  },
  INTEREST_POINT: {
    zIndex: 1220
  },
  MEASUREMENT: {
    code: 'measurement',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.MEASUREMENT,
    zIndex: 1210
  },
  MISSION_SELECTED: {
    code: 'mission_selected',
    zIndex: 1100
  },
  MISSIONS: {
    code: 'missions',
    zIndex: 1000
  },
  REGULATORY_ENV: {
    code: 'REGULATORY_ENV',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: 'environment_regulatory_areas',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.REGULATORY,
    zIndex: 900
  },
  REGULATORY_ENV_PREVIEW: {
    code: 'REGULATORY_ENV_PREVIEW',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: null,
    zIndex: 950
  },
  SIX_MILES: {
    code: '6_miles_areas',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '6 Milles',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  THREE_MILES: {
    code: '3_miles_areas',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '3 Milles',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  TWELVE_MILES: {
    code: '12_miles_areas',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '12 Milles',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  }
}

export const baseLayers = {
  DARK: {
    code: 'DARK',
    text: 'Fond de carte sombre'
  },
  LIGHT: {
    code: 'LIGHT',
    text: 'Fond de carte clair'
  },
  OSM: {
    code: 'OSM',
    text: 'Open Street Map'
  },
  SATELLITE: {
    code: 'SATELLITE',
    text: 'Satellite'
  },
  SHOM: {
    code: 'SHOM',
    text: 'Carte marine (SHOM)'
  }
}

export const SelectableLayers = [Layers.MISSIONS.code, Layers.REGULATORY_ENV_PREVIEW.code, Layers.REGULATORY_ENV.code]
export const HoverableLayers = [Layers.MISSIONS.code, Layers.ACTIONS.code]
