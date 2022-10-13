import { layersGroups, layersType } from './layers'

export const administrativeLayers = [
  [
    {
      code: 'eez_areas',
      containsMultipleZones: true,
      group: null,
      isIntersectable: true,
      name: 'Zones ZEE',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: 'union',
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: 'fao_areas',
      containsMultipleZones: true,
      group: null,
      isIntersectable: true,
      name: 'Zones FAO / CIEM',
      showMultipleZonesInAdministrativeZones: false,
      subSubZoneFieldKey: 'f_subdivis',
      subZoneFieldKey: 'f_division',
      type: layersType.ADMINISTRATIVE,
      zoneFieldKey: 'f_subarea'
    }
  ],
  [
    {
      code: '3_miles_areas',
      containsMultipleZones: false,
      group: null,
      isIntersectable: false,
      name: '3 Milles',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: '6_miles_areas',
      containsMultipleZones: false,
      group: null,
      isIntersectable: false,
      name: '6 Milles',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: '12_miles_areas',
      containsMultipleZones: false,
      group: null,
      isIntersectable: false,
      name: '12 Milles',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: 'cormoran_areas',
      containsMultipleZones: true,
      group: null,
      isIntersectable: true,
      name: 'Zones Cormoran (NAMO-SA)',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: 'zonex',
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: 'aem_areas',
      containsMultipleZones: false,
      group: null,
      isIntersectable: false,
      name: 'Zones AEM (MED)',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: 'name',
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: 'rectangles_stat_areas',
      containsMultipleZones: true,
      group: null,
      isIntersectable: true,
      name: 'Rectangles statistiques',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: 'icesname',
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: '1241_eaux_occidentales_australes_areas',
      containsMultipleZones: false,
      group: layersGroups.TWELVE_FORTY_ONE,
      isIntersectable: true,
      name: 'Eaux occidentales australes',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: '1241_eaux_occidentales_septentrionales_areas',
      containsMultipleZones: false,
      group: layersGroups.TWELVE_FORTY_ONE,
      isIntersectable: true,
      name: 'Eaux occidentales septentrionales',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: '1241_eaux_union_dans_oi_et_atl_ouest_areas',
      containsMultipleZones: false,
      group: layersGroups.TWELVE_FORTY_ONE,
      isIntersectable: true,
      name: "Eaux de l'Union dans l'OI et l'Atl. ouest",
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: '1241_mer_baltique_areas',
      containsMultipleZones: false,
      group: layersGroups.TWELVE_FORTY_ONE,
      isIntersectable: true,
      name: 'Mer Baltique',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: '1241_mer_du_nord_areas',
      containsMultipleZones: false,
      group: layersGroups.TWELVE_FORTY_ONE,
      isIntersectable: true,
      name: 'Mer du Nord',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: '1241_mer_mediterranee_areas',
      containsMultipleZones: false,
      group: layersGroups.TWELVE_FORTY_ONE,
      isIntersectable: true,
      name: 'Mer Méditerranée',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: '1241_mer_noire_areas',
      containsMultipleZones: false,
      group: layersGroups.TWELVE_FORTY_ONE,
      isIntersectable: true,
      name: 'Mer Noire',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: 'fao_ccamlr_areas',
      containsMultipleZones: false,
      group: {
        code: 'orgp',
        name: 'Zones ORGP'
      },
      isIntersectable: true,
      name: 'CCAMLR',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: 'fao_iccat_areas',
      containsMultipleZones: false,
      group: {
        code: 'orgp',
        name: 'Zones ORGP'
      },
      isIntersectable: true,
      name: 'ICCAT',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: 'fao_iotc_areas',
      containsMultipleZones: false,
      group: {
        code: 'orgp',
        name: 'Zones ORGP'
      },
      isIntersectable: true,
      name: 'IOTC',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: 'fao_neafc_areas',
      containsMultipleZones: false,
      group: {
        code: 'orgp',
        name: 'Zones ORGP'
      },
      isIntersectable: true,
      name: 'NEAFC',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: 'fao_siofa_areas',
      containsMultipleZones: false,
      group: {
        code: 'orgp',
        name: 'Zones ORGP'
      },
      isIntersectable: true,
      name: 'SIOFA',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: null,
      type: layersType.ADMINISTRATIVE
    },
    {
      code: 'cgpm_areas',
      containsMultipleZones: true,
      group: {
        code: 'orgp',
        name: 'Zones ORGP'
      },
      isIntersectable: true,
      name: 'Zones CGPM',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: 'SMU_CODE',
      type: layersType.ADMINISTRATIVE
    }
  ],
  [
    {
      code: 'brexit_areas.1',
      group: layersGroups.VMS_SITUATION_BREXIT,
      groupCode: 'brexit_areas',
      isSubZone: true,
      name: 'Alantique',
      showMultipleZonesInAdministrativeZones: true
    },
    {
      code: 'brexit_areas.2',
      group: layersGroups.VMS_SITUATION_BREXIT,
      groupCode: 'brexit_areas',
      isSubZone: true,
      name: 'Manche',
      showMultipleZonesInAdministrativeZones: true
    },
    {
      code: 'brexit_areas.3',
      group: layersGroups.VMS_SITUATION_BREXIT,
      groupCode: 'brexit_areas',
      isSubZone: true,
      name: 'Mer-du-Nord',
      showMultipleZonesInAdministrativeZones: true
    }
  ]
]
