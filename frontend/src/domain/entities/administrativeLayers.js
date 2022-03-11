import { layersGroups, layersType }  from './layers'

export const administrativeLayers = [
  [
    {
      "code": "eez_areas",
      "name": "Zones ZEE",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": true,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": "union",
      "isIntersectable": true
    }
  ],
  [
    {
      "code": "fao_areas",
      "name": "Zones FAO / CIEM",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": true,
      "showMultipleZonesInAdministrativeZones": false,
      "zoneFieldKey": "f_subarea",
      "subZoneFieldKey": "f_division",
      "subSubZoneFieldKey": "f_subdivis",
      "isIntersectable": true
    }
  ],
  [
    {
      "code": "3_miles_areas",
      "name": "3 Milles",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": false
    }
  ],
  [
    {
      "code": "6_miles_areas",
      "name": "6 Milles",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": false
    }
  ],
  [
    {
      "code": "12_miles_areas",
      "name": "12 Milles",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": false
    }
  ],
  [
    {
      "code": "cormoran_areas",
      "name": "Zones Cormoran (NAMO-SA)",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": true,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": "zonex",
      "isIntersectable": true
    }
  ],
  [
    {
      "code": "aem_areas",
      "name": "Zones AEM (MED)",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": "name",
      "isIntersectable": false
    }
  ],
  [
    {
      "code": "rectangles_stat_areas",
      "name": "Rectangles statistiques",
      "group": null,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": true,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": "icesname",
      "isIntersectable": true
    }
  ],
  [
    {
      "code": "1241_eaux_occidentales_australes_areas",
      "name": "Eaux occidentales australes",
      "group": layersGroups.TWELVE_FORTY_ONE,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "1241_eaux_occidentales_septentrionales_areas",
      "name": "Eaux occidentales septentrionales",
      "group": layersGroups.TWELVE_FORTY_ONE,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "1241_eaux_union_dans_oi_et_atl_ouest_areas",
      "name": "Eaux de l'Union dans l'OI et l'Atl. ouest",
      "group": layersGroups.TWELVE_FORTY_ONE,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "1241_mer_baltique_areas",
      "name": "Mer Baltique",
      "group": layersGroups.TWELVE_FORTY_ONE,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "1241_mer_du_nord_areas",
      "name": "Mer du Nord",
      "group": layersGroups.TWELVE_FORTY_ONE,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "1241_mer_mediterranee_areas",
      "name": "Mer Méditerranée",
      "group": layersGroups.TWELVE_FORTY_ONE,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "1241_mer_noire_areas",
      "name": "Mer Noire",
      "group": layersGroups.TWELVE_FORTY_ONE,
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    }
  ],
  [
    {
      "code": "fao_ccamlr_areas",
      "name": "CCAMLR",
      "group": {
        "code": "orgp",
        "name": "Zones ORGP"
      },
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "fao_iccat_areas",
      "name": "ICCAT",
      "group": {
        "code": "orgp",
        "name": "Zones ORGP"
      },
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "fao_iotc_areas",
      "name": "IOTC",
      "group": {
        "code": "orgp",
        "name": "Zones ORGP"
      },
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "fao_neafc_areas",
      "name": "NEAFC",
      "group": {
        "code": "orgp",
        "name": "Zones ORGP"
      },
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "fao_siofa_areas",
      "name": "SIOFA",
      "group": {
        "code": "orgp",
        "name": "Zones ORGP"
      },
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": false,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": null,
      "isIntersectable": true
    },
    {
      "code": "cgpm_areas",
      "name": "Zones CGPM",
      "group": {
        "code": "orgp",
        "name": "Zones ORGP"
      },
      "type": layersType.ADMINISTRATIVE,
      "containsMultipleZones": true,
      "showMultipleZonesInAdministrativeZones": false,
      "subZoneFieldKey": "SMU_CODE",
      "isIntersectable": true
    }
  ],
  [
    {
      "group": layersGroups.VMS_SITUATION_BREXIT,
      "groupCode": "brexit_areas",
      "name": "Alantique",
      "code": "brexit_areas.1",
      "showMultipleZonesInAdministrativeZones": true,
      "isSubZone": true
    },
    {
      "group": layersGroups.VMS_SITUATION_BREXIT,
      "groupCode": "brexit_areas",
      "name": "Manche",
      "code": "brexit_areas.2",
      "showMultipleZonesInAdministrativeZones": true,
      "isSubZone": true
    },
    {
      "group": layersGroups.VMS_SITUATION_BREXIT,
      "groupCode": "brexit_areas",
      "name": "Mer-du-Nord",
      "code": "brexit_areas.3",
      "showMultipleZonesInAdministrativeZones": true,
      "isSubZone": true
    }
  ]
]