/* eslint-disable typescript-sort-keys/string-enum */

import { vehicleTypeLabels } from './vehicleType'

// Mission
export enum TargetTypeEnum {
  COMPANY = 'COMPANY',
  INDIVIDUAL = 'INDIVIDUAL',
  VEHICLE = 'VEHICLE'
}
export enum TargetTypeLabels {
  VEHICLE = 'Véhicule',
  COMPANY = 'Personne morale',
  INDIVIDUAL = 'Personne physique'
}

// Reporting
export enum ReportingTargetTypeEnum {
  COMPANY = 'COMPANY',
  INDIVIDUAL = 'INDIVIDUAL',
  VEHICLE = 'VEHICLE',
  OTHER = 'OTHER'
}

export enum ReportingTargetTypeLabels {
  VEHICLE = 'Véhicule',
  COMPANY = 'Personne morale',
  INDIVIDUAL = 'Personne physique',
  OTHER = 'Autre'
}

export const GENERIC_TARGET_TYPE = [
  ReportingTargetTypeLabels.COMPANY,
  ReportingTargetTypeLabels.OTHER,
  ReportingTargetTypeLabels.VEHICLE,
  ReportingTargetTypeLabels.INDIVIDUAL,
  vehicleTypeLabels.OTHER_SEA.label,
  vehicleTypeLabels.VEHICLE_AIR.label,
  vehicleTypeLabels.VEHICLE_LAND.label,
  vehicleTypeLabels.VESSEL.label
]
