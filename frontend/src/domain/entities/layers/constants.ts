export enum LayerType {
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  BASE_LAYER = 'BASE_LAYER',
  FREE_DRAW = 'FREE_DRAW',
  MEASUREMENT = 'MEASUREMENT',
  REGULATORY = 'REGULATORY'
}

type Layer = {
  code: string
  getZoneName?: (feature: any) => string
  name?: string
  subSubZoneFieldKey?: string
  subZoneFieldKey?: string
  type?: LayerType
  zIndex?: number
  zoneFieldKey?: string
}

export enum MonitorEnvLayers {
  ACTIONS = 'ACTIONS',
  AEM = 'AEM',
  AMP = 'AMP',
  AMP_PREVIEW = 'AMP_PREVIEW',
  BASE_LAYER = 'BASE_LAYER',
  DEPARTMENTS = 'DEPARTMENTS',
  DRAW = 'DRAW',
  EEZ = 'EEZ',
  FACADES = 'FACADES',
  FAO = 'FAO',
  HOVERED_MISSION = 'HOVERED_MISSION',
  INTEREST_POINT = 'INTEREST_POINT',
  LOW_WATER_LINE = 'LOW_WATER_LINE',
  MEASUREMENT = 'MEASUREMENT',
  MISSIONS = 'MISSIONS',
  MISSION_SELECTED = 'MISSION_SELECTED',
  MISSION_TO_ATTACH_ON_REPORTING = 'MISSION_TO_ATTACH_ON_REPORTING',
  REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA = 'REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA',
  REGULATORY_ENV = 'REGULATORY_ENV',
  REGULATORY_ENV_PREVIEW = 'REGULATORY_ENV_PREVIEW',
  REPORTINGS = 'REPORTINGS',
  REPORTING_SELECTED = 'REPORTING_SELECTED',
  REPORTING_TO_ATTACH_ON_MISSION = 'REPORTING_TO_ATTACH_ON_MISSION',
  SALTWATER_LIMIT_AREAS = 'SALTWATER_LIMIT_AREAS',
  SELECTED_MISSION_TO_ATTACH_ON_REPORTING = 'SELECTED_MISSION_TO_ATTACH_ON_REPORTING',
  SELECTED_REPORTING_TO_ATTACH_ON_MISSION = 'SELECTED_REPORTING_TO_ATTACH_ON_MISSION',
  SEMAPHORES = 'SEMAPHORES',
  SIX_MILES = 'SIX_MILES',
  STATIONS = 'STATIONS',
  STRAIGHT_BASELINE = 'STRAIGHT_BASELINE',
  TERRITORIAL_SEAS = 'TERRITORIAL_SEAS',
  THREE_MILES = 'THREE_MILES',
  TRANSVERSAL_SEA_LIMIT_AREAS = 'TRANSVERSAL_SEA_LIMIT_AREAS',
  TWELVE_MILES = 'TWELVE_MILES',
  VIGILANCE_AREA = 'VIGILANCE_AREA'
}

/**
 * /!\ Do not modify the code property : in some cases, it is the Geoserver layer name, hence the name of the PostGIS table
 */
// TODO Generate `zIndex` from order of declaration rather than manually setting it.
/* eslint-disable sort-keys-fix/sort-keys-fix */
export const Layers: Record<MonitorEnvLayers, Layer> = {
  [MonitorEnvLayers.BASE_LAYER]: {
    code: 'baselayer',
    name: '',
    type: LayerType.BASE_LAYER
  },
  [MonitorEnvLayers.AEM]: {
    code: 'aem_areas',
    name: 'Zones AEM (MED)',
    subZoneFieldKey: 'name',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.EEZ]: {
    code: 'eez_areas',
    name: 'Zones ZEE',
    subZoneFieldKey: 'union',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.FAO]: {
    code: 'fao_areas',
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
    name: 'Zones FAO / CIEM',
    subSubZoneFieldKey: 'f_subdivis',
    subZoneFieldKey: 'f_division',
    type: LayerType.ADMINISTRATIVE,
    zoneFieldKey: 'f_subarea'
  },
  [MonitorEnvLayers.SALTWATER_LIMIT_AREAS]: {
    code: 'saltwater_limit_areas',
    name: 'Limites de salure des eaux',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.TRANSVERSAL_SEA_LIMIT_AREAS]: {
    code: 'transversal_sea_limit_areas',
    name: 'Limites transversales de mer',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.THREE_MILES]: {
    code: '3_miles_areas',
    name: '3 Milles',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.SIX_MILES]: {
    code: '6_miles_areas',
    name: '6 Milles',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.TWELVE_MILES]: {
    code: '12_miles_areas',
    name: '12 Milles',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.TERRITORIAL_SEAS]: {
    code: 'territorial_seas',
    name: 'Eaux territoriales',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.STRAIGHT_BASELINE]: {
    code: 'straight_baseline',
    name: 'Lignes de base droite',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.LOW_WATER_LINE]: {
    code: 'low_water_line',
    name: 'Laisses des basses eaux',
    type: LayerType.ADMINISTRATIVE
  },
  [MonitorEnvLayers.DEPARTMENTS]: {
    code: 'departments_areas',
    name: 'Départements',
    type: LayerType.ADMINISTRATIVE,
    zoneFieldKey: 'name'
  },
  [MonitorEnvLayers.FACADES]: {
    code: 'facade_areas_unextended',
    name: 'Facades',
    type: LayerType.ADMINISTRATIVE,
    zoneFieldKey: 'facade'
  },
  [MonitorEnvLayers.REGULATORY_ENV]: {
    code: MonitorEnvLayers.REGULATORY_ENV,
    name: 'environment_regulatory_areas',
    type: LayerType.REGULATORY,
    zIndex: 900
  },
  [MonitorEnvLayers.AMP]: {
    code: 'AMP',
    name: 'environment_amp_areas',
    type: LayerType.REGULATORY,
    zIndex: 925
  },
  [MonitorEnvLayers.AMP_PREVIEW]: {
    code: 'AMP',
    name: 'environment_amp_areas',
    type: LayerType.REGULATORY,
    zIndex: 935
  },
  [MonitorEnvLayers.REGULATORY_ENV_PREVIEW]: {
    code: MonitorEnvLayers.REGULATORY_ENV_PREVIEW,
    name: '',
    zIndex: 950
  },
  [MonitorEnvLayers.SELECTED_MISSION_TO_ATTACH_ON_REPORTING]: {
    code: MonitorEnvLayers.SELECTED_MISSION_TO_ATTACH_ON_REPORTING,
    zIndex: 2000
  },
  [MonitorEnvLayers.SELECTED_REPORTING_TO_ATTACH_ON_MISSION]: {
    code: MonitorEnvLayers.SELECTED_REPORTING_TO_ATTACH_ON_MISSION,
    zIndex: 1700
  },
  [MonitorEnvLayers.REPORTING_SELECTED]: {
    code: MonitorEnvLayers.REPORTING_SELECTED,
    zIndex: 1700
  },
  [MonitorEnvLayers.REPORTING_TO_ATTACH_ON_MISSION]: {
    code: MonitorEnvLayers.REPORTING_TO_ATTACH_ON_MISSION,
    zIndex: 1700
  },
  [MonitorEnvLayers.MISSION_SELECTED]: {
    code: MonitorEnvLayers.MISSION_SELECTED,
    zIndex: 2000
  },
  [MonitorEnvLayers.MISSION_TO_ATTACH_ON_REPORTING]: {
    code: MonitorEnvLayers.MISSION_TO_ATTACH_ON_REPORTING,
    zIndex: 2000
  },
  [MonitorEnvLayers.MISSIONS]: {
    code: MonitorEnvLayers.MISSIONS,
    zIndex: 2000
  },
  [MonitorEnvLayers.HOVERED_MISSION]: {
    code: MonitorEnvLayers.MISSIONS,
    zIndex: 1800
  },
  [MonitorEnvLayers.REPORTINGS]: {
    code: MonitorEnvLayers.REPORTINGS,
    zIndex: 1700
  },
  [MonitorEnvLayers.ACTIONS]: {
    code: MonitorEnvLayers.ACTIONS,
    zIndex: 1800
  },
  [MonitorEnvLayers.MEASUREMENT]: {
    code: MonitorEnvLayers.MEASUREMENT,
    name: '',
    type: LayerType.MEASUREMENT,
    zIndex: 1210
  },
  [MonitorEnvLayers.INTEREST_POINT]: {
    code: MonitorEnvLayers.INTEREST_POINT,
    zIndex: 1220
  },
  [MonitorEnvLayers.SEMAPHORES]: {
    code: MonitorEnvLayers.SEMAPHORES,
    zIndex: 1500
  },
  [MonitorEnvLayers.DRAW]: {
    code: 'draw_layer',
    zIndex: 1500
  },
  [MonitorEnvLayers.STATIONS]: {
    code: MonitorEnvLayers.STATIONS,
    zIndex: 1600
  },
  [MonitorEnvLayers.VIGILANCE_AREA]: {
    code: MonitorEnvLayers.VIGILANCE_AREA,
    zIndex: 1600
  },
  [MonitorEnvLayers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA]: {
    code: MonitorEnvLayers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA,
    zIndex: 1600
  }
}

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

// Priority of selectable items is determined by the order of the layers in this array
// The first layer in the array has the highest priority
// Different hoverable arrays are used depending on the zoom level
// Zoom level goes from 0 (furthest from earth) to 26 (closest from earth)
export const SelectableLayers0To7 = [
  [MonitorEnvLayers.MISSIONS],
  [MonitorEnvLayers.MISSION_TO_ATTACH_ON_REPORTING],
  [MonitorEnvLayers.REPORTING_TO_ATTACH_ON_MISSION],
  [MonitorEnvLayers.REPORTINGS],
  [MonitorEnvLayers.SEMAPHORES],
  [MonitorEnvLayers.STATIONS],
  [
    MonitorEnvLayers.AMP,
    MonitorEnvLayers.AMP_PREVIEW,
    MonitorEnvLayers.REGULATORY_ENV_PREVIEW,
    MonitorEnvLayers.REGULATORY_ENV,
    MonitorEnvLayers.VIGILANCE_AREA
  ]
]

export const SelectableLayers7To26 = [
  [MonitorEnvLayers.MISSIONS],
  [MonitorEnvLayers.MISSION_TO_ATTACH_ON_REPORTING],
  [MonitorEnvLayers.REPORTING_TO_ATTACH_ON_MISSION],
  [MonitorEnvLayers.REPORTINGS],
  [MonitorEnvLayers.SEMAPHORES],
  [MonitorEnvLayers.STATIONS],
  [
    MonitorEnvLayers.AMP,
    MonitorEnvLayers.AMP_PREVIEW,
    MonitorEnvLayers.REGULATORY_ENV_PREVIEW,
    MonitorEnvLayers.REGULATORY_ENV,
    MonitorEnvLayers.VIGILANCE_AREA
  ]
]

// Priority of hoverable items is determined by the order of the layers in this array
// The first layer in the array has the highest priority
// Different hoverable arrays are used depending on the zoom level
// Zoom level goes from 0 (furthest from earth) to 26 (closest from earth)

export const HoverableLayers0To7 = [
  [MonitorEnvLayers.ACTIONS],
  [MonitorEnvLayers.MISSIONS],
  [MonitorEnvLayers.MISSION_TO_ATTACH_ON_REPORTING],
  [MonitorEnvLayers.REPORTING_TO_ATTACH_ON_MISSION],
  [MonitorEnvLayers.REPORTINGS],
  [MonitorEnvLayers.SEMAPHORES],
  [MonitorEnvLayers.STATIONS],
  [MonitorEnvLayers.VIGILANCE_AREA]
]

export const HoverableLayers7To26 = [
  [MonitorEnvLayers.ACTIONS],
  [MonitorEnvLayers.MISSIONS],
  [MonitorEnvLayers.MISSION_TO_ATTACH_ON_REPORTING],
  [MonitorEnvLayers.REPORTING_TO_ATTACH_ON_MISSION],
  [MonitorEnvLayers.REPORTINGS],
  [MonitorEnvLayers.SEMAPHORES],
  [MonitorEnvLayers.STATIONS],
  [
    MonitorEnvLayers.AMP,
    MonitorEnvLayers.AMP_PREVIEW,
    MonitorEnvLayers.REGULATORY_ENV_PREVIEW,
    MonitorEnvLayers.REGULATORY_ENV,
    MonitorEnvLayers.VIGILANCE_AREA
  ]
]

export type RegulatoryOrAMPOrViglanceAreaLayerType =
  | MonitorEnvLayers.AMP
  | MonitorEnvLayers.AMP_PREVIEW
  | MonitorEnvLayers.REGULATORY_ENV
  | MonitorEnvLayers.REGULATORY_ENV_PREVIEW
  | MonitorEnvLayers.VIGILANCE_AREA
  | MonitorEnvLayers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA

export const RegulatoryOrAMPOrViglanceAreaLayerTypeAsList = [
  MonitorEnvLayers.AMP,
  MonitorEnvLayers.AMP_PREVIEW,
  MonitorEnvLayers.REGULATORY_ENV,
  MonitorEnvLayers.REGULATORY_ENV_PREVIEW,
  MonitorEnvLayers.VIGILANCE_AREA,
  MonitorEnvLayers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA
]
