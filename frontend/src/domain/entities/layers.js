/**
 *
 * @param {Object} layer
 * @param { String } layer.type
 * @param { String } layer.topic
 * @param { String } layer.zone
 * @returns String
 */
export const getLayerNameNormalized = layer => [layer.type, layer.topic, layer.zone].filter(Boolean).join(':')

export const layersGroups = {
  ORGP: {
    code: 'orgp',
    name: 'Zones ORGP'
  },
  TWELVE_FORTY_ONE: {
    code: 'twelve_forty_one',
    name: 'Zones du 1241'
  },
  VMS_SITUATION: {
    code: 'vms_situation',
    name: 'Zones pour situation VMS'
  },
  VMS_SITUATION_BREXIT: {
    code: 'vms_situation_brexit',
    name: 'Zones pour situation VMS Brexit'
  }
}

export const layersType = {
  ADMINISTRATIVE: 'ADMINISTRATIVE',
  BASE_LAYER: 'BASE_LAYER',
  FREE_DRAW: 'FREE_DRAW',
  MEASUREMENT: 'MEASUREMENT',
  REGULATORY: 'REGULATORY'
}

const Layers = {
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
  CCAMLR: {
    code: 'fao_ccamlr_areas',
    containsMultipleZones: false,
    group: layersGroups.ORGP,
    isIntersectable: true,
    name: 'CCAMLR',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  brexit: {
    code: 'brexit_areas',
    containsMultipleZones: true,
    group: layersGroups.VMS_SITUATION_BREXIT,
    name: 'Zones pour situation Brexit',
    showMultipleZonesInAdministrativeZones: true,
    isIntersectable: true,
    type: layersType.ADMINISTRATIVE,
    subZoneFieldKey: 'nom'
  },
  cgpm_areas: {
    code: 'cgpm_areas',
    containsMultipleZones: true,
    group: layersGroups.ORGP,
    name: 'Zones CGPM',
    isIntersectable: true,
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: 'SMU_CODE',
    type: layersType.ADMINISTRATIVE
  },
  cormoran: {
    code: 'cormoran_areas',
    containsMultipleZones: true,
    group: null,
    isIntersectable: true,
    name: 'Zones Cormoran (NAMO-SA)',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: 'zonex',
    type: layersType.ADMINISTRATIVE
  },
  DRAW_LAYER: {
    code: 'draw_layer',
    zIndex: 1500
  },
  eaux_occidentales_australes: {
    code: '1241_eaux_occidentales_australes_areas',
    containsMultipleZones: false,
    group: layersGroups.TWELVE_FORTY_ONE,
    isIntersectable: true,
    name: 'Eaux occidentales australes',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  eaux_occidentales_septentrionales: {
    code: '1241_eaux_occidentales_septentrionales_areas',
    containsMultipleZones: false,
    group: layersGroups.TWELVE_FORTY_ONE,
    isIntersectable: true,
    name: 'Eaux occidentales septentrionales',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  eaux_union_dans_oi_et_atl_ouest: {
    code: '1241_eaux_union_dans_oi_et_atl_ouest_areas',
    containsMultipleZones: false,
    group: layersGroups.TWELVE_FORTY_ONE,
    isIntersectable: true,
    name: "Eaux de l'Union dans l'OI et l'Atl. ouest",
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
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
  ICCAT: {
    code: 'fao_iccat_areas',
    containsMultipleZones: false,
    group: layersGroups.ORGP,
    isIntersectable: true,
    name: 'ICCAT',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  INTEREST_POINT: {
    zIndex: 1220
  },
  IOTC: {
    code: 'fao_iotc_areas',
    containsMultipleZones: false,
    group: layersGroups.ORGP,
    isIntersectable: true,
    name: 'IOTC',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
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
  mer_baltique: {
    code: '1241_mer_baltique_areas',
    containsMultipleZones: false,
    group: layersGroups.TWELVE_FORTY_ONE,
    isIntersectable: true,
    name: 'Mer Baltique',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  mer_du_nord: {
    code: '1241_mer_du_nord_areas',
    containsMultipleZones: false,
    group: layersGroups.TWELVE_FORTY_ONE,
    isIntersectable: true,
    name: 'Mer du Nord',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  mer_mediterranee: {
    code: '1241_mer_mediterranee_areas',
    containsMultipleZones: false,
    group: layersGroups.TWELVE_FORTY_ONE,
    isIntersectable: true,
    name: 'Mer Méditerranée',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  mer_noire: {
    code: '1241_mer_noire_areas',
    containsMultipleZones: false,
    group: layersGroups.TWELVE_FORTY_ONE,
    isIntersectable: true,
    name: 'Mer Noire',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  MISSION_SELECTED: {
    code: 'mission_selected',
    zIndex: 1100
  },
  MISSIONS: {
    code: 'missions',
    zIndex: 1000
  },
  NEAFC: {
    code: 'fao_neafc_areas',
    containsMultipleZones: false,
    group: layersGroups.ORGP,
    isIntersectable: true,
    name: 'NEAFC',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  rectangles_stat: {
    code: 'rectangles_stat_areas',
    containsMultipleZones: true,
    group: null,
    isIntersectable: true,
    name: 'Rectangles statistiques',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: 'icesname',
    type: layersType.ADMINISTRATIVE
  },
  REGULATORY: {
    code: 'regulatory_areas',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.REGULATORY
  },
  REGULATORY_ENV: {
    code: 'environment_regulatory_areas',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.REGULATORY,
    zIndex: 1500
  },
  REGULATORY_PREVIEW: {
    code: 'regulatory_preview',
    containsMultipleZones: false,
    group: null,
    isIntersectable: false,
    name: '',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: null
  },
  SIOFA: {
    code: 'fao_siofa_areas',
    containsMultipleZones: false,
    group: layersGroups.ORGP,
    isIntersectable: true,
    name: 'SIOFA',
    showMultipleZonesInAdministrativeZones: false,
    subZoneFieldKey: null,
    type: layersType.ADMINISTRATIVE
  },
  situations: {
    code: 'situs_areas',
    containsMultipleZones: true,
    group: layersGroups.VMS_SITUATION,
    isIntersectable: true,
    name: 'Zones pour situation VMS',
    showMultipleZonesInAdministrativeZones: true,
    subZoneFieldKey: 'libelle',
    type: layersType.ADMINISTRATIVE
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

export const SelectableLayers = [Layers.MISSIONS.code]
export const HoverableLayers = [Layers.MISSIONS.code, Layers.ACTIONS.code]

export default Layers
