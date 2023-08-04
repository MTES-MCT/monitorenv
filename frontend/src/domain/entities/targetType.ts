/* eslint-disable sort-keys-fix/sort-keys-fix */
export enum TargetTypeEnum {
  COMPANY = 'COMPANY',
  INDIVIDUAL = 'INDIVIDUAL',
  VEHICLE = 'VEHICLE'
}
export const targetTypeLabels = {
  VEHICLE: {
    label: 'Véhicule',
    value: 'VEHICLE'
  },
  COMPANY: {
    label: 'Société',
    value: 'COMPANY'
  },
  INDIVIDUAL: {
    label: 'Personne physique',
    value: 'INDIVIDUAL'
  }
}
