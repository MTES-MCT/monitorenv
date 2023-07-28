export enum VehicleTypeEnum {
  OTHER_SEA = 'OTHER_SEA',
  VEHICLE_AIR = 'VEHICLE_AIR',
  VEHICLE_LAND = 'VEHICLE_LAND',
  VESSEL = 'VESSEL'
}

export const vehicleTypeLabels = {
  OTHER_SEA: {
    label: 'Autre véhicule marin',
    value: 'OTHER_SEA'
  },
  VEHICLE_AIR: {
    label: 'Véhicule aérien',
    value: 'VEHICLE_AIR'
  },
  VEHICLE_LAND: {
    label: 'Véhicule terrestre',
    value: 'VEHICLE_LAND'
  },
  VESSEL: {
    label: 'Navire',
    value: 'VESSEL'
  }
}
