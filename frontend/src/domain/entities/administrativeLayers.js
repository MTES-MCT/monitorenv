import { layersType } from './layers'

export const administrativeLayers = [
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
      code: 'aem_areas',
      containsMultipleZones: false,
      group: null,
      isIntersectable: false,
      name: 'Zones AEM (MED)',
      showMultipleZonesInAdministrativeZones: false,
      subZoneFieldKey: 'name',
      type: layersType.ADMINISTRATIVE
    }
  ]
]
